import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PDFGenerator = {
  generateReport(analysisResult, date = new Date()) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    this.addHeader(doc, pageWidth);

    const formattedDate = date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${formattedDate}`, pageWidth - 15, 20, { align: 'right' });

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('AI-Powered Car Analysis Report', pageWidth / 2, 30, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('This report was generated using advanced AI image recognition technology', pageWidth / 2, 37, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(255, 140, 0);
    doc.text('Car Characteristics', 15, 50);

    let characteristics = [];
    if (analysisResult.individual_analyses) {
      characteristics = Object.entries(analysisResult.consolidated_characteristics)
        .map(([key, value]) => [
          key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value
        ]);
    } else {
      characteristics = Object.entries(analysisResult.characteristics)
        .map(([key, value]) => [
          key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          value
        ]);
    }

    autoTable(doc, {
      startY: 55,
      head: [['Characteristic', 'Value']],
      body: characteristics,
      theme: 'striped',
      headStyles: {
        fillColor: [255, 140, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [255, 240, 220]
      },
      styles: {
        fontSize: 11,
        cellPadding: 3,
      }
    });

    const priceTableY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(13);
    doc.setTextColor(255, 140, 0);
    doc.text('Price Estimation', 15, priceTableY);

    const priceData = [
      ['Estimated Price Range', analysisResult.price_estimation.estimated_price_range],
      ['Base Price', analysisResult.price_estimation.base_price.toLocaleString()],
      ['Brand Factor', `${analysisResult.price_estimation.brand_factor}x`],
      ['Condition Factor', `${analysisResult.price_estimation.condition_factor}x`]
    ];

    autoTable(doc, {
      startY: priceTableY + 5,
      body: priceData,
      theme: 'grid',
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        1: { halign: 'right' }
      }
    });

    const disclaimerY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Disclaimer:', 15, disclaimerY);

    const disclaimerText = 'This estimation is based on AI analysis of the provided images and should be considered as a reference only. ' +
      'The actual value may vary depending on market conditions, specific details not visible in the images, ' +
      'and other factors. We recommend consulting with a professional appraiser for an official valuation.';

    doc.setFontSize(9);
    const splitDisclaimer = doc.splitTextToSize(disclaimerText, pageWidth - 30);
    doc.text(splitDisclaimer, 15, disclaimerY + 5);

    if (analysisResult.individual_analyses) {
      const confidenceY = disclaimerY + splitDisclaimer.length * 5 + 15;
      doc.setFontSize(13);
      doc.setTextColor(255, 140, 0);
      doc.text('Analysis Confidence Metrics', 15, confidenceY);

      const confidenceData = [
        ['Images Processed', analysisResult.images_processed],
        ['Analysis Quality', analysisResult.analysis_summary.analysis_quality],
        ['Overall Confidence', `${Math.round(analysisResult.analysis_summary.overall_confidence * 100)}%`]
      ];

      autoTable(doc, {
        startY: confidenceY + 5,
        body: confidenceData,
        theme: 'plain',
        styles: {
          fontSize: 11,
          cellPadding: 4,
        },
        columnStyles: {
          0: { fontStyle: 'bold' },
        }
      });
    }

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      this.addFooter(doc, pageWidth, pageHeight);
    }

    return doc;
  },

  addHeader(doc, pageWidth) {
    doc.setFillColor(20, 20, 30);
    doc.rect(0, 0, pageWidth, 15, 'F');

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('AI Car Analyzer', 15, 10);

    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(0, 15, pageWidth, 15);
  },

  addFooter(doc, pageWidth, pageHeight) {
    doc.setFillColor(20, 20, 30);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');

    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text('© ' + new Date().getFullYear() + ' AI Car Analyzer. All Rights Reserved.', 15, pageHeight - 7);

    doc.text('Page ' + doc.internal.getCurrentPageInfo().pageNumber + ' of ' + doc.internal.getNumberOfPages(), 
      pageWidth - 15, pageHeight - 7, { align: 'right' });

    doc.setDrawColor(255, 140, 0);
    doc.setLineWidth(0.5);
    doc.line(0, pageHeight - 15, pageWidth, pageHeight - 15);
  },

  downloadPDF(analysisResult) {
    const doc = this.generateReport(analysisResult);

    let filename = 'car-analysis-report';
    const characteristics = analysisResult.individual_analyses ? 
      analysisResult.consolidated_characteristics : 
      analysisResult.characteristics;

    if (characteristics.make && characteristics.make !== 'Unknown') {
      filename = `${characteristics.make.toLowerCase()}`;
      if (characteristics.model && characteristics.model !== 'Unknown') {
        filename += `-${characteristics.model.toLowerCase()}`;
      }
      filename += '-analysis-report';
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    filename += `-${timestamp}.pdf`;

    doc.save(filename);
  }
};

export default PDFGenerator;
