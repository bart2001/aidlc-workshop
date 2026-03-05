import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = '로딩 중...' }) => (
  <div className="loading-spinner" role="status" aria-label={message}>
    <div className="spinner" />
    <p>{message}</p>
  </div>
);

export default LoadingSpinner;
