import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { FiAlertTriangle, FiRefreshCw, FiX } from 'react-icons/fi';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error?: {
    title: string;
    message: string;
    type: 'network' | 'ai-service' | 'validation' | 'general';
    retryable?: boolean;
  };
  onRetry?: () => void;
}

const errorTypes = {
  'network': {
    icon: FiAlertTriangle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  'ai-service': {
    icon: FiAlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
  },
  'validation': {
    icon: FiAlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
  },
  'general': {
    icon: FiAlertTriangle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
  },
};

export function ErrorModal({ isOpen, onClose, error, onRetry }: ErrorModalProps) {
  if (!error) return null;

  const errorConfig = errorTypes[error.type] || errorTypes.general;
  const IconComponent = errorConfig.icon;

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Network Error';
      case 'ai-service':
        return 'AI Service Unavailable';
      case 'validation':
        return 'Validation Error';
      default:
        return 'Something went wrong';
    }
  };

  const getErrorSuggestions = () => {
    switch (error.type) {
      case 'network':
        return [
          'Check your internet connection',
          'Try refreshing the page',
          'Contact support if the problem persists',
        ];
      case 'ai-service':
        return [
          'The AI service is temporarily unavailable',
          'Please try again in a few moments',
          'Check our status page for updates',
        ];
      case 'validation':
        return [
          'Please check your input and try again',
          'Make sure all required fields are filled',
          'Verify your data format is correct',
        ];
      default:
        return [
          'Please try again',
          'Contact support if the problem continues',
        ];
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${errorConfig.bgColor}`}>
              <IconComponent className={`h-5 w-5 ${errorConfig.color}`} />
            </div>
            <h2 className="text-xl font-semibold">{getErrorTitle()}</h2>
          </div>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">{error.title}</h3>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">What you can do:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {getErrorSuggestions().map((suggestion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {error.type === 'network' && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Network Status:</strong> If you're experiencing connectivity issues, 
                  please check your internet connection and firewall settings.
                </p>
              </div>
            )}
            
            {error.type === 'ai-service' && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  <strong>Service Status:</strong> Our AI service is experiencing high demand. 
                  Please wait a moment and try again.
                </p>
              </div>
            )}
          </div>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {error.retryable && onRetry && (
            <Button
              color="primary"
              startContent={<FiRefreshCw className="h-4 w-4" />}
              onClick={() => {
                onRetry();
                onClose();
              }}
            >
              Try Again
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
