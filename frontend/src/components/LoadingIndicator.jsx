import React from 'react';

const LoadingIndicator = () => {
  return (
    <div className="loading" style={{ display: 'block' }}>
      <div className="loading-spinner"></div>
      <div className="loading-text">Analyzing your car images with AI...</div>
      <div className="loading-subtext">This may take 30-60 seconds per image</div>
    </div>
  );
};

export default LoadingIndicator;