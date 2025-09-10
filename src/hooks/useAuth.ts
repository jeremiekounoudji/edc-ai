import { useState, useCallback } from 'react';
import { AuthState, User, LoginCredentials, RegisterData, ForgotPasswordData, OTPData } from '@/types/auth';
import { mockAuthService } from '@/lib/auth/mockAuth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const setLoading = useCallback((isLoading: boolean) => {
    setAuthState(prev => ({ ...prev, isLoading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setAuthState(prev => ({ ...prev, error }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.login(credentials);
      
      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.register(data);
      
      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during registration';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.forgotPassword(data);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const sendOTP = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.sendOTP(email);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const verifyOTP = useCallback(async (data: OTPData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.verifyOTP(data);
      
      if (response.success) {
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.loginWithGoogle();
      
      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during Google login';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const registerWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await mockAuthService.registerWithGoogle();
      
      if (response.success && response.user) {
        setAuthState({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return { success: true, message: response.message };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred during Google registration';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const logout = useCallback(() => {
    setAuthState(initialState);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    ...authState,
    login,
    register,
    forgotPassword,
    sendOTP,
    verifyOTP,
    loginWithGoogle,
    registerWithGoogle,
    logout,
    clearError,
  };
};
