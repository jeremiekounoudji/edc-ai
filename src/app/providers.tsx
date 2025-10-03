// app/providers.tsx
'use client'

import {HeroUIProvider, ToastProvider} from '@heroui/react'
import { NavigationProvider } from '../context/NavigationContext'
import { AuthProvider } from '@/components/providers/AuthProvider'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider 
        placement="top-center" 
        containerProps={{
          style: {
            zIndex: 9999,
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            maxWidth: '90vw'
          }
        }}
      />
      <AuthProvider>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </AuthProvider>
    </HeroUIProvider>
  )
}