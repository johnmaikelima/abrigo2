'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * HOC para proteger rotas que requerem autenticação de administrador
 * @param Component Componente a ser protegido
 * @returns Componente protegido
 */
export function withAdminAuth(Component: React.ComponentType<any>) {
  return function WithAdminAuth(props: any) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const isLoading = status === 'loading';
    const isAuthenticated = status === 'authenticated';
    const isAdmin = session?.user?.role === 'admin';

    useEffect(() => {
      // Se não estiver carregando e não estiver autenticado, redireciona para login
      if (!isLoading && !isAuthenticated) {
        router.push('/login?callbackUrl=/dashboard');
        return;
      }

      // Se estiver autenticado mas não for admin, redireciona para dashboard
      if (!isLoading && isAuthenticated && !isAdmin) {
        router.push('/dashboard');
        return;
      }
    }, [isLoading, isAuthenticated, isAdmin, router]);

    // Enquanto estiver carregando ou verificando permissões, mostra um indicador de carregamento
    if (isLoading || !isAuthenticated || !isAdmin) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Se for admin, renderiza o componente protegido
    return <Component {...props} />;
  };
}
