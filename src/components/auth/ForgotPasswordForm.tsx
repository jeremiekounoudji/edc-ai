'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { validateForgotPasswordForm } from '@/lib/auth/validation';
import { mockAuthService } from '@/lib/auth/mockAuth';
import { ValidationError } from '@/types/auth';

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function ForgotPasswordForm({ onSuccess, onBackToLogin }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors.length > 0) {
      setErrors(prev => prev.filter(error => error.field !== field));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForgotPasswordForm(formData.email);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Clear previous errors
    setErrors([]);
    setIsLoading(true);

    try {
      // Submit form
      const result = await mockAuthService.forgotPassword(formData);
      
      if (result.success) {
        setIsSuccess(true);
        addToast({
          title: 'Success',
          description: 'Password reset email sent!',
          color: 'success',
          variant: 'flat'
        });
        onSuccess?.();
      } else {
        addToast({
          title: 'Error',
          description: result.message,
          color: 'danger',
          variant: 'flat'
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        color: 'danger',
        variant: 'flat'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            We've sent a password reset link to <strong>{formData.email}</strong>
          </p>
        </CardHeader>
        
        <CardBody className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="space-y-3">
              <Button
                color="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({ email: '' });
                }}
              >
                Try Another Email
              </Button>
              
              <Button
                variant="bordered"
                size="lg"
                className="w-full"
                onClick={onBackToLogin}
                startContent={<FiArrowLeft className="w-4 h-4" />}
              >
                Back to Login
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center pb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Forgot Password?
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </CardHeader>
      
      <CardBody className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              startContent={<FiMail className="text-gray-400" />}
              isInvalid={!!getFieldError('email')}
              errorMessage={getFieldError('email')}
              variant="bordered"
              size="lg"
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            color="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Sending Reset Link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center justify-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
