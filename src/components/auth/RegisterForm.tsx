'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Select, SelectItem } from '@heroui/select';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Spinner } from '@heroui/spinner';
import { addToast } from '@heroui/toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { validateRegisterForm } from '@/lib/auth/validation';
import { getUserRoles } from '@/lib/auth/mockAuth';
import { ValidationError, UserRole } from '@/types/auth';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

export function RegisterForm({ onSuccess, onLogin }: RegisterFormProps) {
  const { register, registerWithGoogle, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: '' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const userRoles = getUserRoles();

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
    const validationErrors = validateRegisterForm(formData);
    if (validationErrors.length > 0) {
      // Show validation errors in toast
      validationErrors.forEach(error => {
        addToast({
          title: 'Validation Error',
          description: error.message,
          color: 'danger',
          variant: 'flat'
        });
      });
      return;
    }

    // Clear previous errors
    setErrors([]);

    // Submit form
    const result = await register(formData);
    
    if (result.success) {
      addToast({
        title: 'Success',
        description: 'Account created successfully!',
        color: 'success',
        variant: 'flat'
      });
      onSuccess?.();
    } else {
      addToast({
        title: 'Registration Failed',
        description: result.message,
        color: 'danger',
        variant: 'flat'
      });
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await registerWithGoogle();
      if (result.success) {
        addToast({
          title: 'Success',
          description: 'Google registration successful!',
          color: 'success',
          variant: 'flat'
        });
        onSuccess?.();
      } else {
        addToast({
          title: 'Google Registration Failed',
          description: result.message,
          color: 'danger',
          variant: 'flat'
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const getGeneralError = () => {
    return errors.find(error => error.field === 'general')?.message;
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="text-center pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>
      </CardHeader>
      
      <CardBody className="space-y-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Sign up for a new account
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                label="First Name"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                startContent={<FiUser className="text-gray-400" />}
                isInvalid={!!getFieldError('firstName')}
                errorMessage={getFieldError('firstName')}
                variant="bordered"
                size="lg"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                label="Last Name"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                startContent={<FiUser className="text-gray-400" />}
                isInvalid={!!getFieldError('lastName')}
                errorMessage={getFieldError('lastName')}
                variant="bordered"
                size="lg"
                required
              />
            </div>
          </div>

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

          {/* Password Fields Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                startContent={<FiLock className="text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                  >
                    {showPassword ? (
                      <FiEyeOff className="text-gray-400" />
                    ) : (
                      <FiEye className="text-gray-400" />
                    )}
                  </button>
                }
                isInvalid={!!getFieldError('password')}
                errorMessage={getFieldError('password')}
                variant="bordered"
                size="lg"
                required
              />
            </div>
            <div>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                startContent={<FiLock className="text-gray-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff className="text-gray-400" />
                    ) : (
                      <FiEye className="text-gray-400" />
                    )}
                  </button>
                }
                isInvalid={!!getFieldError('confirmPassword')}
                errorMessage={getFieldError('confirmPassword')}
                variant="bordered"
                size="lg"
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <Select
              label="Role"
              placeholder="Select your role"
              selectedKeys={formData.role ? [formData.role] : []}
              onSelectionChange={(keys) => {
                const selectedRole = Array.from(keys)[0] as UserRole;
                handleInputChange('role', selectedRole || '');
              }}
              variant="bordered"
              size="lg"
              isInvalid={!!getFieldError('role')}
              errorMessage={getFieldError('role')}
              required
            >
              {userRoles.map((role) => (
                <SelectItem key={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </Select>
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
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Register Button */}
        <Button
          variant="bordered"
          size="lg"
          className="w-full"
          onClick={handleGoogleRegister}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Signing up with Google...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </>
          )}
        </Button>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLogin}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
