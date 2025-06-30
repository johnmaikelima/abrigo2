'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
};

/**
 * Componente que protege rotas baseado na função (role) do usuário
 * @param children - Conteúdo a ser renderizado se o usuário tiver permissão
 * @param allowedRoles - Array de funções permitidas para acessar o conteúdo
 * @param fallback - Conteúdo a ser renderizado se o usuário não tiver permissão
 */
export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback 
}: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Se o usuário não estiver autenticado, redirecionar para o login
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Enquanto verifica a sessão, mostrar um loader
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Se o usuário estiver autenticado, verificar se tem a função permitida
  if (status === 'authenticated') {
    const userRole = session?.user?.role as string;
    
    if (allowedRoles.includes(userRole)) {
      return <>{children}</>;
    }
    
    // Se o usuário não tiver a função permitida, mostrar o fallback ou uma mensagem de acesso negado
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Acesso Negado</h1>
        <p className="text-gray-600">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return null;
}
