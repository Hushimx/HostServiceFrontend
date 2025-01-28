'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { DashboardAuthProvider } from '@/contexts/AdminAuthContext';
export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DashboardAuthProvider>
        {/* <DashboardAuth>{children}</DashboardAuth> */}
        {children}
      </DashboardAuthProvider>
      </ThemeProvider>
    </>
  );
}
