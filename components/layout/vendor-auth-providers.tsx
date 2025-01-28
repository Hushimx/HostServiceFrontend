'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
import { VendorAuthProvider } from '@/contexts/vendorAuthContext';
export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <VendorAuthProvider>
        {/* <DashboardAuth>{children}</DashboardAuth> */}
        {children}
      </VendorAuthProvider>
      </ThemeProvider>
    </>
  );
}
