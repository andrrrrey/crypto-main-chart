import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

interface RedirectingErrorBoundaryProps {
  children: React.ReactNode;
}

const RedirectingErrorBoundary: React.FC<RedirectingErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasError) {
      navigate('/', { replace: true });
    }
  }, [hasError, navigate]);

  return (
    <ErrorBoundary fallbackRender={({ error }) => {
      console.error('ErrorBoundary caught an error', error);
      setHasError(true);
      return null;
    }}>
      {children}
    </ErrorBoundary>
  );
};

export default RedirectingErrorBoundary;
