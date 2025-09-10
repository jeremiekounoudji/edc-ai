'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    // Redirect to chat page after successful registration
    router.push('/chat');
  };

  const handleLogin = () => {
    // Navigate to login page
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterForm 
          onSuccess={handleRegisterSuccess}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
}
