import React from 'react';
import { useRouter } from 'next/navigation';
import { hasPermission,Permission } from '@/lib/rbac';
import { useDashboardAuth } from '@/contexts/AdminAuthContext';

const withPermission = (requiredPermissions: Permission) => (Component: React.ComponentType) => {
  const WrappedComponent = (props: any) => {
    const { role } = useDashboardAuth();
    const router = useRouter();

    const hasAccess = hasPermission(role, requiredPermissions);

    React.useEffect(() => {
      if (!hasAccess) {
        router.replace('/'); // Redirect to unauthorized page
      }
    }, [hasAccess, router]);

    if (!hasAccess) {
      return null; // Optionally render a loading spinner or message
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withPermission;
