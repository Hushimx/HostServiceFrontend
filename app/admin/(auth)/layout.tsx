import KBar from '@/components/kbar';
import Providers from '@/components/layout/admin-auth-providers';
import AdminLayoutProvider from '@/components/layout/admin-layout-provider';
import {  AdminNavItems } from '@/constants/data';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'Host Service Dashboard',
  description: 'Host Service Admin Dashboard'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = cookies();
  const sidebarState = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <>
    <NextTopLoader showSpinner={false} />
    <Providers >
    <KBar navItems={AdminNavItems}>
      <AdminLayoutProvider navItems={AdminNavItems} sidebarState={sidebarState}>
      {children}
      </AdminLayoutProvider>
    </KBar>
    </Providers>
    </>
  );
}
