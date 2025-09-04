import React from 'react';

const IndividualAnalyses = ({ analyses }) => {
  if (!analyses || analyses.length === 0) return null;
  
  return (
    <div className="individual-analyses">
      <h3 style={{ color: '#ff8c00', marginBottom: '1.5rem' }}>
        <i className="fas fa-images"></i> Individual Image Analyses
      </h3>
      
      {analyses.map((analysis, index) => (
        <div className="individual-analysis-item" key={index}>
          <div className="analysis-item-header">
            <div className="analysis-item-title">
              <i className="fas fa-image"></i> {analysis.image_name}
            </div>
            <div className="confidence-badge">
              {Math.round(analysis.confidence_score * 100)}% confidence
            </div>
          </div>
          <div className="characteristic-item">
            <span className="characteristic-label">Key Findings</span>
            <span className="characteristic-value">
              {Object.entries(analysis.characteristics)
                .filter(([k, v]) => v !== "Not specified" && v !== "Unknown")
                .slice(0, 3)
                .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
                .join(', ') || 'Limited information extracted'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndividualAnalyses;