import { PropsWithChildren } from 'react';

import NoPermissionCard from '@/components/no-permission-card';
import { auth } from '@clerk/nextjs/server';

interface HasPermissionProps extends PropsWithChildren {
  permission: (userId: string | null) => Promise<boolean>;
  renderFallback?: boolean;
  fallbackText?: string;
}

const HasPermission = async ({
  permission,
  renderFallback = false,
  fallbackText,
  children,
}: HasPermissionProps) => {
  const { userId } = await auth();
  const hasPermission = await permission(userId);
  if (hasPermission) return children;
  if (renderFallback) return <NoPermissionCard>{fallbackText}</NoPermissionCard>;
  return null;
};

export default HasPermission;
