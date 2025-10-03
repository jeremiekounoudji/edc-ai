# AI Agent Instructions for EDC-AI Project

## Project Overview
This is a Next.js project featuring a chat interface with AI capabilities, authentication system, and document/supplier management. The project uses Hero UI components, Tailwind CSS, and follows a modular architecture.

## Key Architecture Points
1. **App Router Structure**
   - Pages under `src/app/` following Next.js 13+ conventions
   - Each feature has its own directory (auth, chat, documents, suppliers)
   - Shared components in `src/components/`

2. **Component Patterns**
   - Use Hero UI components for UI elements (buttons, inputs, cards)
   - Consistent styling with Tailwind CSS
   - Components follow atomic design (ui/, layout/, feature-specific folders)
   - Form components handle their own state and validation

3. **Authentication System**
   - Mock authentication service in `src/lib/auth/mockAuth.ts`
   - Custom `useAuth` hook manages auth state
   - Role-based access with predefined roles
   - OTP verification flow included

4. **State Management**
   - React hooks for local state
   - Custom hooks for feature-specific logic (`useAuth`, `useChat`, etc.)
   - Context providers where needed (`NavigationContext`)

## File Structure Conventions
- Components: `src/components/[feature]/[ComponentName].tsx`
- Pages: `src/app/[feature]/page.tsx`
- Hooks: `src/hooks/use[Feature].ts`
- Types: `src/types/[feature].ts`
- Utils: `src/lib/[feature]/[utility].ts`

## Key Integration Points
1. **Chat System**
   - AI chat interface in `src/components/chat/`
   - Message handling through `useChat` hook
   - Integration with external AI service

2. **Document Management**
   - Document grid and filters in `src/components/documents/`
   - Bulk actions and pagination patterns
   - File upload handling

3. **Supplier Management**
   - Similar structure to documents
   - Contact integration via `ContactPopover`

## Common Patterns
1. **Form Handling**
   ```typescript
   const [formData, setFormData] = useState(initialState);
   const handleInputChange = (field: string, value: string) => {
     setFormData(prev => ({ ...prev, [field]: value }));
   };
   ```

2. **Error Management**
   ```typescript
   const [errors, setErrors] = useState<ValidationError[]>([]);
   // Clear error on input change
   if (errors.length > 0) {
     setErrors(prev => prev.filter(error => error.field !== field));
   }
   ```

3. **Loading States**
   ```typescript
   const [isLoading, setIsLoading] = useState(false);
   // Use in async operations
   try {
     setIsLoading(true);
     // async operation
   } finally {
     setIsLoading(false);
   }
   ```

## Important Considerations
1. Always use Hero UI components for consistent UI
2. Follow existing patterns for form validation
3. Handle loading and error states appropriately
4. Use TypeScript types from `src/types/`
5. Implement responsive design with Tailwind breakpoints