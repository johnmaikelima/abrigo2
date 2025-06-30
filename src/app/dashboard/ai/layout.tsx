import { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { RoleGuard } from '@/components/auth/role-guard';

export const metadata: Metadata = {
  title: 'Assistente de IA | Dashboard',
  description: 'Use a inteligência artificial para gerar conteúdo para o seu blog.',
};

export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['admin']}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {children}
        </div>
      </RoleGuard>
    </ProtectedRoute>
  );
}
