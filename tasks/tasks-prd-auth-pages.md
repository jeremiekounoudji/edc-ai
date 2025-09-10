# Task List: Authentication Pages Implementation

Based on the PRD for authentication pages, here are the detailed tasks required to implement the feature:

## Relevant Files

- `src/app/auth/login/page.tsx` - Main login page component with email/password and Google OAuth ✅
- `src/app/auth/register/page.tsx` - Registration page component with role selection ✅
- `src/app/auth/forgot-password/page.tsx` - Forgot password page component ✅
- `src/components/auth/LoginForm.tsx` - Reusable login form component ✅
- `src/components/auth/RegisterForm.tsx` - Reusable registration form component ✅
- `src/components/auth/ForgotPasswordForm.tsx` - Forgot password form component ✅
- `src/components/auth/OTPModal.tsx` - OTP verification modal component
- `src/lib/auth/validation.ts` - Authentication form validation utilities ✅
- `src/lib/auth/mockAuth.ts` - Mock authentication functions for development ✅
- `src/types/auth.ts` - TypeScript types for authentication data ✅
- `src/hooks/useAuth.ts` - Custom hook for authentication state management ✅

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- All components must use Hero UI components exclusively as specified in the PRD.
- No backend integration required - use mock functions for development.

## Tasks

- [x] 1.0 Setup Authentication Pages Structure and Routing
  - [x] 1.1 Create authentication page directory structure (`src/app/auth/`)
  - [x] 1.2 Set up routing for login, register, and forgot-password pages
  - [x] 1.3 Create shared authentication components directory (`src/components/auth/`)
  - [x] 1.4 Set up authentication utilities directory (`src/lib/auth/`)
  - [x] 1.5 Create TypeScript types for authentication data (`src/types/auth.ts`)
  - [x] 1.6 Set up mock authentication functions for development

- [x] 2.0 Implement Login Page with Email/Password and Google OAuth
  - [x] 2.1 Create LoginForm component with email and password fields using Hero UI
  - [x] 2.2 Implement email format validation with inline error messages
  - [x] 2.3 Implement password requirements validation (8+ chars, number, special char)
  - [x] 2.4 Add "Login with Google" button using Hero UI components
  - [x] 2.5 Implement form submission handling with loading states
  - [x] 2.6 Add "Forgot Password?" link navigation
  - [x] 2.7 Create login page wrapper component (`src/app/auth/login/page.tsx`)
  - [x] 2.8 Implement redirect to main page after successful login
  - [x] 2.9 Add responsive design for mobile and desktop
  - [x] 2.10 Write unit tests for LoginForm component

- [x] 3.0 Implement Registration Page with Role Selection
  - [x] 3.1 Create RegisterForm component with all required fields using Hero UI
  - [x] 3.2 Implement email, password, confirm password, first name, last name fields
  - [x] 3.3 Create role dropdown with options: Admin, Moderator, Manager, Employee, Procurement Officer, Financer, Legal
  - [x] 3.4 Implement email format and uniqueness validation
  - [x] 3.5 Implement password confirmation matching validation
  - [x] 3.6 Add "Register with Google" button using Hero UI components
  - [x] 3.7 Implement form submission handling with loading states
  - [x] 3.8 Create registration page wrapper component (`src/app/auth/register/page.tsx`)
  - [x] 3.9 Implement redirect to main page after successful registration
  - [x] 3.10 Add responsive design for mobile and desktop
  - [x] 3.11 Write unit tests for RegisterForm component

- [x] 4.0 Implement Forgot Password Page
  - [x] 4.1 Create ForgotPasswordForm component with email field using Hero UI
  - [x] 4.2 Implement email format validation with inline error messages
  - [x] 4.3 Add form submission handling with loading states
  - [x] 4.4 Implement success message display after email submission
  - [x] 4.5 Add "Back to Login" link navigation
  - [x] 4.6 Create forgot password page wrapper component (`src/app/auth/forgot-password/page.tsx`)
  - [x] 4.7 Add responsive design for mobile and desktop
  - [x] 4.8 Write unit tests for ForgotPasswordForm component

- [ ] 5.0 Implement OTP Verification Modal Component
  - [ ] 5.1 Create OTPModal component using Hero UI modal components
  - [ ] 5.2 Implement 6-digit OTP input field with proper formatting
  - [ ] 5.3 Add OTP format validation (6 digits only)
  - [ ] 5.4 Implement "Resend OTP" functionality with countdown timer
  - [ ] 5.5 Add error message display for invalid OTP
  - [ ] 5.6 Implement modal close and proceed to main page on successful verification
  - [ ] 5.7 Add loading states for OTP submission and resend
  - [ ] 5.8 Integrate OTP modal with login and registration flows
  - [ ] 5.9 Add responsive design for mobile and desktop
  - [ ] 5.10 Write unit tests for OTPModal component

- [ ] 6.0 Create Authentication Utilities and Hooks
  - [ ] 6.1 Create validation utilities for email, password, and OTP formats
  - [ ] 6.2 Implement custom useAuth hook for authentication state management
  - [ ] 6.3 Create mock authentication functions for development
  - [ ] 6.4 Implement form state management utilities
  - [ ] 6.5 Add error handling utilities for authentication flows
  - [ ] 6.6 Write unit tests for all utility functions and hooks
