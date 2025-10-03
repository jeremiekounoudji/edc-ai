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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Blur dark overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      
      <div className="w-full max-w-md relative z-10">
        <ForgotPasswordForm 
          onSuccess={handleSuccess}
          onBackToLogin={handleBackToLogin}
        />
      </div>
    </div>
  );
}
