import React, { useState } from 'react';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import LoadingIndicator from './components/LoadingIndicator';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFiles = (files) => {
    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(`${file.name} is larger than 10MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Limit to 10 images total
    const totalFiles = selectedFiles.length + validFiles.length;
    if (totalFiles > 10) {
      setErrorMessage('Maximum 10 images allowed. Please remove some images first.');
      return;
    }

    // Add new files to selected files
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setErrorMessage('');
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetAnalyzer = () => {
    setSelectedFiles([]);
    setShowResults(false);
    setAnalysisResult(null);
    setErrorMessage('');
  };

  const analyzeImages = async () => {
    if (selectedFiles.length === 0) return;

    setIsLoading(true);
    setShowResults(false);
    
    try {
      // Determine the correct API URL
      const isLocalDevelopment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1' ||
                              window.location.port === '5500';
      
      const baseUrl = isLocalDevelopment ? 'http://localhost:8000' : '';
      const endpoint = selectedFiles.length > 1 ? '/analyze-multiple' : '/analyze';
      const apiUrl = baseUrl + endpoint;

      console.log('Attempting to connect to:', apiUrl);
      console.log('Number of files:', selectedFiles.length);

      let response;
      
      if (selectedFiles.length === 1) {
        // Single image analysis
        const formData = new FormData();
        formData.append('file', selectedFiles[0]);
        
        response = await fetch(baseUrl + '/analyze', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
      } else {
        // Multiple images analysis
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('files', file);
        });
        
        response = await fetch(baseUrl + '/analyze-multiple', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `Server error: ${response.status} ${response.statusText}`;
        
        if (response.status === 404) {
          throw new Error(`API endpoint not found. Make sure FastAPI server is running on port 8000. Tried: ${apiUrl}`);
        } else if (response.status === 0 || response.status >= 500) {
          throw new Error('Cannot connect to server. Please ensure FastAPI server is running on localhost:8000');
        } else {
          throw new Error(errorMessage);
        }
      }

      const result = await response.json();
      console.log('Analysis result:', result);
      
      setAnalysisResult(result);
      setShowResults(true);

    } catch (error) {
      console.error('Analysis failed:', error);
      
      // Provide more helpful error messages
      let userMessage = error.message;
      
      if (error.message.includes('fetch')) {
        userMessage = 'Cannot connect to the analysis server. Please make sure:\n' +
                     '1. FastAPI server is running (python your_backend_file.py)\n' +
                     '2. Server is accessible on localhost:8000\n' +
                     '3. No firewall is blocking the connection';
      } else if (error.message.includes('Not Found')) {
        userMessage = 'Analysis endpoint not found. Please verify:\n' +
                     '1. FastAPI server is running with the latest backend code\n' +
                     '2. Server is running on the correct port (8000)\n' +
                     '3. All API endpoints are properly configured';
      }
      
      setErrorMessage(`Analysis failed: ${userMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="animated-bg">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <Header />

      <div className="main-card">
        {!isLoading && !showResults && (
          <UploadSection 
            selectedFiles={selectedFiles} 
            handleFiles={handleFiles}
            removeFile={removeFile}
            analyzeImages={analyzeImages}
            errorMessage={errorMessage}
          />
        )}

        {isLoading && <LoadingIndicator />}

        {showResults && analysisResult && (
          <ResultsSection 
            result={analysisResult} 
            resetAnalyzer={resetAnalyzer} 
          />
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default App;