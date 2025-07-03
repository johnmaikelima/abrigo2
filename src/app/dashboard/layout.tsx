import { DashboardLayout as DashboardLayoutComponent } from '@/components/dashboard/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RoleGuard } from '@/components/auth/role-guard';
import { Toaster } from '@/components/ui/toaster';
import { Metadata } from 'next';

// Metadata específica para o dashboard
export const metadata: Metadata = {
  title: 'Blog Admin',
  description: 'Painel administrativo do blog',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin', 'editor']}>
        <DashboardLayoutComponent>
          {children}
        </DashboardLayoutComponent>
        <Toaster />
      </RoleGuard>
    </ProtectedRoute>
  );
}
