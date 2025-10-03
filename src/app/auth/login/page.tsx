'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Redirect to chat page after successful login
    router.push('/chat');
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page
    router.push('/auth/forgot-password');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Blur dark overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="w-full max-w-md relative z-10">
        <LoginForm 
          onSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </div>
  );
}
