'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleSuccess = () => {
    // Optionally redirect to login page after successful submission
    // router.push('/auth/login');
  };

  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <ForgotPasswordForm 
          onSuccess={handleSuccess}
          onBackToLogin={handleBackToLogin}
        />
      </div>
    </div>
  );
}
