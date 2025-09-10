import { User, LoginCredentials, RegisterData, ForgotPasswordData, OTPData, AuthResponse, UserRole } from '@/types/auth';

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock OTP storage
const mockOTPCodes: Map<string, { code: string; expiresAt: Date }> = new Map();

export const mockAuthService = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }
    
    // For demo purposes, accept any password
    return {
      success: true,
      message: 'Login successful',
      user,
      token: 'mock-jwt-token',
    };
  },

  // Register new user
  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'Email already exists',
      };
    }
    
    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      message: 'Registration successful',
      user: newUser,
      token: 'mock-jwt-token',
    };
  },

  // Send forgot password email
  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers.find(u => u.email === data.email);
    
    if (!user) {
      return {
        success: false,
        message: 'Email not found',
      };
    }
    
    // In a real app, this would send an email
    console.log(`Password reset email sent to ${data.email}`);
    
    return {
      success: true,
      message: 'Password reset email sent',
    };
  },

  // Send OTP code
  async sendOTP(email: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    mockOTPCodes.set(email, { code: otpCode, expiresAt });
    
    // In a real app, this would send an email
    console.log(`OTP code for ${email}: ${otpCode}`);
    
    return {
      success: true,
      message: 'OTP code sent',
    };
  },

  // Verify OTP code
  async verifyOTP(data: OTPData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const storedOTP = mockOTPCodes.get(data.email);
    
    if (!storedOTP) {
      return {
        success: false,
        message: 'OTP code not found or expired',
      };
    }
    
    if (new Date() > storedOTP.expiresAt) {
      mockOTPCodes.delete(data.email);
      return {
        success: false,
        message: 'OTP code expired',
      };
    }
    
    if (storedOTP.code !== data.code) {
      return {
        success: false,
        message: 'Invalid OTP code',
      };
    }
    
    // Remove used OTP
    mockOTPCodes.delete(data.email);
    
    return {
      success: true,
      message: 'OTP verified successfully',
    };
  },

  // Google OAuth login (mock)
  async loginWithGoogle(): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Mock Google user data
    const googleUser: User = {
      id: 'google-1',
      email: 'user@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      role: 'employee',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return {
      success: true,
      message: 'Google login successful',
      user: googleUser,
      token: 'mock-google-jwt-token',
    };
  },

  // Google OAuth registration (mock)
  async registerWithGoogle(): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    // Mock Google user data
    const googleUser: User = {
      id: 'google-2',
      email: 'newuser@gmail.com',
      firstName: 'New',
      lastName: 'Google User',
      role: 'employee',
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    return {
      success: true,
      message: 'Google registration successful',
      user: googleUser,
      token: 'mock-google-jwt-token',
    };
  },
};

export const getUserRoles = (): { value: UserRole; label: string }[] => [
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'procurement_officer', label: 'Procurement Officer' },
  { value: 'financer', label: 'Financer' },
  { value: 'legal', label: 'Legal' },
];
