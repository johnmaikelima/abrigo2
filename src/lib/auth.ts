import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from './auth-options';

// Middleware para verificar se o usuário está autenticado
export async function withAuth(handler: Function) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      );
    }

    return handler(req, session);
  };
}

// Middleware para verificar se o usuário é um administrador
export async function withAdminAuth(handler: Function) {
  return async (req: Request) => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      );
    }

    // Verificar se o usuário tem a role de admin
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Você não tem permissão para acessar este recurso.' },
        { status: 403 }
      );
    }

    return handler(req, session);
  };
}

// Função para verificar se o usuário está autenticado (para uso em componentes do servidor)
export async function isAuthenticated() {
  const session = await getServerSession(authOptions);
  return !!session?.user;
}

// Função para verificar se o usuário é um administrador (para uso em componentes do servidor)
export async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}
