import React from 'react';
import AnalysisSummary from './AnalysisSummary';
import IndividualAnalyses from './IndividualAnalyses';
import DownloadReportButton from './DownloadRepportButton';

const ResultsSection = ({ result, resetAnalyzer }) => {
  const isMultipleImages = result && result.individual_analyses;
  
  // Determine which characteristics to display
  const characteristics = isMultipleImages 
    ? result.consolidated_characteristics 
    : (result?.characteristics || {});
  
  // Determine which price estimation to display
  const priceEstimation = result?.price_estimation || {};
  
  return (
    <div className="results-section" style={{ display: 'block' }}>
      {/* Show summary panel only for multiple image analysis */}
      {isMultipleImages && <AnalysisSummary summary={result} />}
      
      <div className="results-grid">
        <div className="result-panel">
          <div className="panel-title">
            <i className="fas fa-list-ul"></i> Car Characteristics
          </div>
          <div>
            {Object.entries(characteristics).map(([key, value], index) => (
              <div className="characteristic-item" key={index}>
                <span className="characteristic-label">{key.replace(/_/g, ' ')}</span>
                <span className="characteristic-value">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="result-panel">
          <div className="panel-title">
            <i className="fas fa-dollar-sign"></i> Price Estimation
          </div>
          
          <div className="price-highlight">
            <div className="price-amount">{priceEstimation.estimated_price_range || '-'}</div>
            <div className="price-label">Estimated Value Range</div>
          </div>

          <div>
            <div className="characteristic-item">
              <span className="characteristic-label">Base Price</span>
              <span className="characteristic-value">
                {priceEstimation.base_price?.toLocaleString() || '-'}
              </span>
            </div>
            <div className="characteristic-item">
              <span className="characteristic-label">Brand Factor</span>
              <span className="characteristic-value">
                {priceEstimation.brand_factor || '-'}x
              </span>
            </div>
            <div className="characteristic-item">
              <span className="characteristic-label">Condition Factor</span>
              <span className="characteristic-value">
                {priceEstimation.condition_factor || '-'}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Show individual analyses section only for multiple image analysis */}
      {isMultipleImages && <IndividualAnalyses analyses={result.individual_analyses} />}

      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <DownloadReportButton analysisResult={result} />
        </div>
        <button className="reset-btn" onClick={resetAnalyzer}>
          <i className="fas fa-redo"></i> Analyze Another Car
        </button>
      </div>
    </div>
  );
};

export default ResultsSection;

