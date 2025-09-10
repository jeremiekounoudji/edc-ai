'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Redirect to main page after successful login
    router.push('/');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    router.push('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  );
}
