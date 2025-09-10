import React from 'react';
import { Spinner } from '@heroui/spinner';

interface LoadingStatesProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ type = 'spinner', size = 'md', text, className = '' }: LoadingStatesProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  if (type === 'dots') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        {text && <span className={`ml-2 ${textSizeClasses[size]} text-muted-foreground`}>{text}</span>}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-primary rounded-full animate-pulse`} />
        {text && <span className={`${textSizeClasses[size]} text-muted-foreground`}>{text}</span>}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Spinner size={size} color="primary" />
      {text && <span className={`${textSizeClasses[size]} text-muted-foreground`}>{text}</span>}
    </div>
  );
}

// Chat-specific loading component
export function ChatLoadingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-muted rounded-2xl px-4 py-3 max-w-xs">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <span className="text-sm text-muted-foreground">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
}

// Project loading component
export function ProjectLoadingSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="h-4 w-4 bg-muted rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Button loading state
interface ButtonLoadingStateProps {
  children: React.ReactNode;
  isLoading: boolean;
  [key: string]: unknown;
}

export function ButtonLoadingState({ children, isLoading, ...props }: ButtonLoadingStateProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${props.className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner type="spinner" size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Page loading overlay
export function PageLoadingOverlay({ isVisible, text = 'Loading...' }: { isVisible: boolean; text?: string }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center">
        <LoadingSpinner type="spinner" size="lg" text={text} />
      </div>
    </div>
  );
}
