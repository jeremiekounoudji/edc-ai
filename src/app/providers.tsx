// app/providers.tsx
'use client'

import {HeroUIProvider, ToastProvider} from '@heroui/react'
import { NavigationProvider } from '../context/NavigationContext'

export function Providers({children}: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" />
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </HeroUIProvider>
  )
}