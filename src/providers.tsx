'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import { AuthProvider } from '@/contexts/auth-context';

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextThemesProvider>
  )
}
