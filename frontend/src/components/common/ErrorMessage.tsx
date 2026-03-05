import React from 'react';

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({ message, onRetry }) => (
  <div className="error-message" role="alert">
    <p>{message}</p>
    {onRetry && (
      <button type="button" className="btn btn-primary" onClick={onRetry}>다시 시도</button>
    )}
  </div>
);

export default ErrorMessage;
