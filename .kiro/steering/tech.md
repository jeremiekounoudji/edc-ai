# Technology Stack & Build System

## Core Framework & Runtime

- **Next.js 15.5.2**: React-based full-stack framework with App Router
- **React 19.1.0**: Latest React with concurrent features
- **TypeScript 5**: Strict type checking enabled
- **Node.js**: Runtime environment

## UI & Styling

- **HeroUI 2.8.4**: Primary component library - use individual component imports
- **Tailwind CSS 4**: Utility-first CSS framework with custom design tokens
- **Framer Motion 12.23.12**: Animation library for smooth interactions
- **React Icons 5.5.0**: Icon library (prefer Feather icons from `react-icons/fi`)

## State Management & Data Fetching

- **Zustand 5.0.8**: Lightweight state management
- **SWR 2.3.6**: Data fetching with caching and revalidation
- **Supabase**: Authentication and database (configured but not fully integrated)

## Development Tools

- **ESLint 9**: Code linting with Next.js config
- **PostCSS**: CSS processing for Tailwind

## Common Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Key Libraries Usage

### HeroUI Components
```tsx
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
```

### Styling Utilities
```tsx
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";
```

### State Management
```tsx
import { create } from "zustand";
```

## Environment Variables

Required environment variables (see `.env`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Build Configuration

- **TypeScript**: Strict mode enabled
- **Tailwind**: Custom color palette with action card themes and CSS variables
- **Next.js**: App Router with default configuration