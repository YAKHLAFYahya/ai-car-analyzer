import React, { useState } from 'react';
import PDFGenerator from '../utils/PDFGenerator';

const DownloadReportButton = ({ analysisResult }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Small delay to allow the UI to update with loading state
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generate and download the PDF
      PDFGenerator.downloadPDF(analysisResult);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <button 
      className="download-btn"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <i className="fas fa-spinner fa-spin"></i> Generating PDF...
        </>
      ) : (
        <>
          <i className="fas fa-file-pdf"></i> Download PDF Report
        </>
      )}
    </button>
  );
};

export default DownloadReportButton;