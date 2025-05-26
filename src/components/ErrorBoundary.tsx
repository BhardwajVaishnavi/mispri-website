'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-red-500 mb-4">
          <AlertTriangle className="w-16 h-16 mx-auto" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>

        {error && process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="text-sm font-medium text-red-800 mb-2">Error Details:</h3>
            <p className="text-xs text-red-700 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetError}
            className="flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="text-red-500 mb-4">
        <AlertTriangle className="w-12 h-12 mx-auto" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Failed to load products
      </h3>
      
      <p className="text-gray-600 mb-4">
        We couldn't load the products. Please check your connection and try again.
      </p>

      <button
        onClick={resetError}
        className="flex items-center justify-center mx-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </button>
    </div>
  );
}

export function CartErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <div className="text-red-500 mb-4">
        <AlertTriangle className="w-10 h-10 mx-auto" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Cart Error
      </h3>
      
      <p className="text-gray-600 mb-4">
        There was an issue with your cart. Please try refreshing the page.
      </p>

      <button
        onClick={resetError}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Refresh Cart
      </button>
    </div>
  );
}
