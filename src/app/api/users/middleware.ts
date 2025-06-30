import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Middleware para verificar se o usuário tem permissão de administrador
 * para acessar as APIs de gerenciamento de usuários
 */
export async function withAdminAuth(
  req: NextRequest,
  handler: (req: NextRequest, params?: any) => Promise<NextResponse>
) {
  try {
    // Obter o token JWT da sessão
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    // Se não houver token ou o usuário não for administrador, retornar erro 403
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas administradores podem gerenciar usuários.' },
        { status: 403 }
      );
    }
    
    // Se o usuário for administrador, continuar com o handler
    return handler(req);
  } catch (error) {
    console.error('Erro no middleware de autenticação de admin:', error);
    return NextResponse.json(
      { error: 'Erro de autenticação' },
      { status: 500 }
    );
  }
}
