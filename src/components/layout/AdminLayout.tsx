import { ReactNode } from 'react';
import { SuperAdminLayout } from './SuperAdminLayout';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}


