import { ValidationError } from '@/types/auth';

export const validateEmail = (email: string): ValidationError | null => {
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  
  return null;
};

export const validatePassword = (password: string): ValidationError | null => {
  if (!password) {
    return { field: 'password', message: 'Password is required' };
  }
  
  return null;
};

export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationError | null => {
  if (!confirmPassword) {
    return { field: 'confirmPassword', message: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { field: 'confirmPassword', message: 'Passwords do not match' };
  }
  
  return null;
};

export const validateName = (name: string, fieldName: 'firstName' | 'lastName'): ValidationError | null => {
  if (!name) {
    return { field: fieldName, message: `${fieldName === 'firstName' ? 'First name' : 'Last name'} is required` };
  }
  
  return null;
};

export const validateRole = (role: string): ValidationError | null => {
  if (!role) {
    return { field: 'role', message: 'Role is required' };
  }
  
  const validRoles = ['admin', 'moderator', 'manager', 'employee', 'procurement_officer', 'financer', 'legal'];
  if (!validRoles.includes(role)) {
    return { field: 'role', message: 'Please select a valid role' };
  }
  
  return null;
};

export const validateOTP = (otp: string): ValidationError | null => {
  if (!otp) {
    return { field: 'otp', message: 'OTP code is required' };
  }
  
  if (!/^\d{6}$/.test(otp)) {
    return { field: 'otp', message: 'OTP code must be 6 digits' };
  }
  
  return null;
};

export const validateLoginForm = (email: string, password: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.push(passwordError);
  
  return errors;
};

export const validateRegisterForm = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  role: string;
}): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(data.password);
  if (passwordError) errors.push(passwordError);
  
  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.push(confirmPasswordError);
  
  const firstnameError = validateName(data.firstname, 'firstName');
  if (firstnameError) errors.push(firstnameError);
  
  const lastnameError = validateName(data.lastname, 'lastName');
  if (lastnameError) errors.push(lastnameError);
  
  const roleError = validateRole(data.role);
  if (roleError) errors.push(roleError);
  
  return errors;
};

export const validateForgotPasswordForm = (email: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  const emailError = validateEmail(email);
  if (emailError) errors.push(emailError);
  
  return errors;
};
