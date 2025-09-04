import React from 'react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="error-message" style={{ display: 'block' }}>
      {message}
    </div>
  );
};

export default ErrorMessage;