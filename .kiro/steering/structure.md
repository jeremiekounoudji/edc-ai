# Project Structure & Organization

## Root Directory Structure

```
├── .kiro/                    # Kiro IDE configuration and steering rules
├── src/                      # Source code
├── public/                   # Static assets
├── doc/                      # Project documentation and summaries
├── tasks/                    # Product requirement documents (PRDs)
├── node_modules/             # Dependencies
└── config files              # Next.js, TypeScript, Tailwind configs
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)
```
src/app/
├── layout.tsx               # Root layout with providers
├── page.tsx                 # Home page
├── globals.css              # Global styles
├── providers.tsx            # App-wide providers (HeroUI, theme)
├── auth/                    # Authentication pages
├── chat/                    # AI chat interface
├── documents/               # Document management
├── suppliers/               # Supplier directory
└── api/                     # API routes
```

### Component Architecture (`src/components/`)
```
src/components/
├── auth/                    # Authentication components
├── chat/                    # Chat interface components
├── documents/               # Document management components
├── suppliers/               # Supplier management components
├── layout/                  # Layout components (headers, sidebars)
├── sidebar/                 # Navigation sidebar components
└── ui/                      # Reusable UI components
```

### Business Logic (`src/lib/`)
```
src/lib/
├── supabase.ts             # Supabase client configuration
├── auth/                   # Authentication utilities
├── services/               # API service functions
├── utils/                  # Utility functions
├── types/                  # Type definitions
└── mockData/               # Mock data for development
```

### State Management (`src/store/`)
```
src/store/
├── useAuthStore.ts         # Authentication state
└── [feature]Store.ts       # Feature-specific stores
```

### Custom Hooks (`src/hooks/`)
```
src/hooks/
├── useAuth.ts              # Authentication hook
├── useChat.ts              # Chat functionality
├── useProject.ts           # Project management
├── useDocuments.ts         # Document operations
├── useSuppliers.ts         # Supplier operations
└── useTheme.ts             # Theme management
```

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `ChatInterface.tsx`)
- **Pages**: lowercase with hyphens (e.g., `forgot-password/`)
- **Hooks**: camelCase starting with "use" (e.g., `useAuth.ts`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase (e.g., `User.ts`, `ApiResponse.ts`)

### Code Conventions
- **React Components**: PascalCase with descriptive names
- **Functions**: camelCase with verb-noun pattern
- **Constants**: UPPER_SNAKE_CASE
- **Interfaces/Types**: PascalCase with descriptive names

## Import Organization

```tsx
// 1. React and Next.js imports
import React from 'react';
import { NextPage } from 'next';

// 2. Third-party libraries
import { Button } from '@heroui/button';
import { motion } from 'framer-motion';

// 3. Internal imports (absolute paths)
import { useAuth } from '@/hooks/useAuth';
import { ChatInterface } from '@/components/chat/ChatInterface';

// 4. Relative imports
import './styles.css';
```

## Component Structure Pattern

```tsx
// Component imports
// Type definitions
// Component implementation
// Default export

interface ComponentProps {
  // Props definition
}

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 
}) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
};

export default ComponentName;
```

## Key Architectural Patterns

1. **Feature-based organization**: Group related components, hooks, and utilities by feature
2. **Separation of concerns**: Keep business logic in hooks and services, UI logic in components
3. **Consistent imports**: Use absolute imports for internal modules (`@/`)
4. **Type safety**: Define interfaces for all props, API responses, and data structures
5. **Reusable components**: Create generic UI components in `src/components/ui/`
6. **Mock data**: Use structured mock data in `src/lib/mockData/` for development

## Documentation Location

- **Feature summaries**: `doc/` directory
- **PRDs**: `tasks/` directory  
- **API documentation**: Inline JSDoc comments
- **Component documentation**: Storybook or inline comments