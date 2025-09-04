import React, { useRef } from 'react';
import ErrorMessage from './ErrorMessage';

const UploadSection = ({ selectedFiles, handleFiles, removeFile, analyzeImages, errorMessage }) => {
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    const uploadArea = e.currentTarget;
    uploadArea.style.borderColor = '#ff8c00';
    uploadArea.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.15), rgba(255, 165, 0, 0.08))';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    const uploadArea = e.currentTarget;
    uploadArea.style.borderColor = 'rgba(255, 140, 0, 0.3)';
    uploadArea.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.02), rgba(255, 165, 0, 0.01))';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const uploadArea = e.currentTarget;
    uploadArea.style.borderColor = 'rgba(255, 140, 0, 0.3)';
    uploadArea.style.background = 'linear-gradient(135deg, rgba(255, 140, 0, 0.02), rgba(255, 165, 0, 0.01))';
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };
  
  return (
    <div className="upload-section">
      <div 
        className="upload-area"
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <i className="fas fa-cloud-upload-alt upload-icon"></i>
        <div className="upload-text">Drop your car images here</div>
        <div className="upload-subtext">or click to browse • Multiple images supported (JPG, PNG, WebP)</div>
        <input 
          type="file" 
          ref={fileInputRef}
          className="file-input" 
          accept="image/*" 
          multiple
          onChange={handleFileSelect}
        />
      </div>
      
      <div className="upload-options">
        <div className="upload-tips">
          <h4><i className="fas fa-lightbulb"></i> Pro Tips for Better Analysis:</h4>
          <ul>
            <li><i className="fas fa-camera"></i> <strong>Exterior:</strong> Front, rear, and side views</li>
            <li><i className="fas fa-car"></i> <strong>Interior:</strong> Dashboard, seats, steering wheel</li>
            <li><i className="fas fa-circle"></i> <strong>Details:</strong> Wheels, tires, any damage</li>
            <li><i className="fas fa-sun"></i> <strong>Lighting:</strong> Good lighting for accurate assessment</li>
          </ul>
        </div>
      </div>
      
      <div id="preview-container">
        {selectedFiles.length > 0 && (
          <>
            <div className="images-preview">
              {selectedFiles.map((file, index) => (
                <PreviewItem 
                  key={index} 
                  file={file} 
                  index={index} 
                  removeFile={removeFile} 
                />
              ))}
            </div>
            
            <div className="success-indicator">
              <i className="fas fa-check-circle"></i> 
              {selectedFiles.length} image{selectedFiles.length > 1 ? 's' : ''} ready for analysis
            </div>
          </>
        )}
      </div>
      
      <div className="analysis-options">
        <button 
          className="analyze-btn" 
          disabled={selectedFiles.length === 0}
          onClick={analyzeImages}
        >
          <i className="fas fa-magic"></i> 
          <span>{selectedFiles.length <= 1 
            ? 'Analyze Car' 
            : `Analyze ${selectedFiles.length} Images`}
          </span>
        </button>
        
        {selectedFiles.length > 0 && (
          <div className="image-counter">
            <i className="fas fa-images"></i> <span>{selectedFiles.length}</span> images selected
          </div>
        )}
      </div>
      
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};

// Helper component for image previews
const PreviewItem = ({ file, index, removeFile }) => {
  const [imageSrc, setImageSrc] = React.useState(null);
  
  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  }, [file]);
  
  return (
    <div className="preview-item" data-index={index}>
      {imageSrc && <img className="preview-image" src={imageSrc} alt={`Preview ${index + 1}`} />}
      <button 
        className="remove-btn"
        onClick={() => removeFile(index)}
      >
        <i className="fas fa-times"></i>
      </button>
      <div className="preview-filename">{file.name}</div>
    </div>
  );
};

export default UploadSection;