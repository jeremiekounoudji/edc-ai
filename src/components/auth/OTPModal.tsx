'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { FiMail, FiRefreshCw } from 'react-icons/fi';
import { validateOTP } from '@/lib/auth/validation';
import { mockAuthService } from '@/lib/auth/mockAuth';
import { ValidationError } from '@/types/auth';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  email: string;
}

export function OTPModal({ isOpen, onClose, onSuccess, email }: OTPModalProps) {
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp('');
      setErrors([]);
      setAttempts(0);
      setResendCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setOtp(digitsOnly);
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async () => {
    // Validate OTP
    const validationError = validateOTP(otp);
    if (validationError) {
      setErrors([validationError]);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const result = await mockAuthService.verifyOTP({ code: otp, email });
      
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'OTP verified successfully!',
          color: 'success',
          variant: 'flat'
        });
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          addToast({
            title: 'Too Many Attempts',
            description: 'Maximum verification attempts reached. Please request a new OTP.',
            color: 'danger',
            variant: 'flat'
          });
          onClose();
        } else {
          addToast({
            title: 'Invalid OTP',
            description: result.message,
            color: 'danger',
            variant: 'flat'
          });
        }
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

  const handleResendOTP = async () => {
    if (resendCountdown > 0) return;
    
    setIsResending(true);
    
    try {
      const result = await mockAuthService.sendOTP(email);
      
      if (result.success) {
        addToast({
          title: 'OTP Sent',
          description: 'A new OTP code has been sent to your email.',
          color: 'success',
          variant: 'flat'
        });
        setResendCountdown(60); // 60 seconds countdown
        setOtp('');
        setErrors([]);
        setAttempts(0);
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
        description: 'Failed to resend OTP. Please try again.',
        color: 'danger',
        variant: 'flat'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && otp.length === 6) {
      handleSubmit();
    }
  };

  const getFieldError = () => {
    return errors.find(error => error.field === 'otp')?.message;
  };

  const remainingAttempts = maxAttempts - attempts;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      placement="center"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      hideCloseButton={true}
    >
      <ModalContent>
        <ModalHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h1>
        </ModalHeader>
        
        <ModalBody className="space-y-6">
          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
          
          {/* OTP Input */}
          <div className="space-y-4">
            <Input
              ref={inputRef}
              type="text"
              label="Verification Code"
              placeholder="000000"
              value={otp}
              onChange={(e) => handleOtpChange(e.target.value)}
              onKeyPress={handleKeyPress}
              isInvalid={!!getFieldError()}
              errorMessage={getFieldError()}
              variant="bordered"
              size="lg"
              className="text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
            
            {/* Attempts Counter */}
            {attempts > 0 && (
              <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
                {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
              </p>
            )}
          </div>

          {/* Resend Section */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Didn't receive the code?
            </p>
            
            <Button
              variant="bordered"
              size="sm"
              onClick={handleResendOTP}
              disabled={isResending || resendCountdown > 0}
              startContent={
                isResending ? (
                  <Spinner size="sm" />
                ) : (
                  <FiRefreshCw className="w-4 h-4" />
                )
              }
            >
              {isResending ? 'Sending...' : 
               resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 
               'Resend Code'}
            </Button>
          </div>
        </ModalBody>
        
        <ModalFooter className="flex-col space-y-3">
          <Button
            color="primary"
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
          
          <Button
            variant="light"
            size="sm"
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400"
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
