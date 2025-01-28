import KBar from '@/components/kbar';
import Providers from '@/components/layout/vendor-auth-providers';
import VendorLayoutProvider from '@/components/layout/vendor-layout-provider';
import { VendorNavItems } from '@/constants/data';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: 'Host Service Dashboard',
  description: 'Host Service Vendor Dashboard'
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
    <KBar navItems={VendorNavItems}>
      <VendorLayoutProvider navItems={VendorNavItems} sidebarState={sidebarState}>
      {children}
      </VendorLayoutProvider>
    </KBar>
    </Providers>
    </>
  );
}
