export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'admin'
  | 'moderator' 
  | 'manager'
  | 'employee'
  | 'procurement_officer'
  | 'financer'
  | 'legal';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface ForgotPasswordData {
  email: string;
}

export interface OTPData {
  code: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
