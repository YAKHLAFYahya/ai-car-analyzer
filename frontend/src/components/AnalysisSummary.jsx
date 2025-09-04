import React from 'react';

const AnalysisSummary = ({ summary }) => {
  if (!summary) return null;
  
  return (
    <div className="analysis-summary-panel">
      <div className="panel-title">
        <i className="fas fa-chart-line"></i> Analysis Summary
      </div>
      <div className="characteristic-item">
        <span className="characteristic-label">Images Processed</span>
        <span className="characteristic-value">{summary.images_processed}</span>
      </div>
      <div className="characteristic-item">
        <span className="characteristic-label">Analysis Quality</span>
        <span className="characteristic-value">{summary.analysis_summary.analysis_quality}</span>
      </div>
      <div className="characteristic-item">
        <span className="characteristic-label">Overall Confidence</span>
        <span className="characteristic-value">
          {Math.round(summary.analysis_summary.overall_confidence * 100)}%
        </span>
      </div>
      <div className="confidence-meter">
        <div 
          className="confidence-fill" 
          style={{ width: `${summary.analysis_summary.overall_confidence * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default AnalysisSummary;