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
       
      />
      <AuthProvider>
        <NavigationProvider>
          {children}
        </NavigationProvider>
      </AuthProvider>
    </HeroUIProvider>
  )
}