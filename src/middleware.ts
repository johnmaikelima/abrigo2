import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não requerem autenticação
const publicPaths = [
  '/login', 
  '/api/auth/signin',
  '/', // Página inicial
  '/blog', // Página de blog
  '/categorias', // Página de categorias
  '/sobre', // Página sobre
];

// Função para verificar se a rota é do site público
const isPublicSite = (pathname: string) => {
  // Verificar se é a raiz ou começa com /blog, /categorias, /sobre
  // Ou se é uma página dinâmica pelo slug (não começando com /dashboard, /api, /login)
  if (pathname === '/' || 
      pathname.startsWith('/blog/') || 
      pathname === '/blog' ||
      pathname.startsWith('/categorias/') ||
      pathname === '/categorias' ||
      pathname.startsWith('/sobre/') ||
      pathname === '/sobre') {
    return true;
  }
  
  // Verificar se é uma página dinâmica pelo slug
  // Qualquer rota que não seja dashboard, api, login e não tenha mais de um nível de profundidade
  // pode ser uma página dinâmica
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1 && 
      !['dashboard', 'api', 'login', '_next', 'favicon.ico'].includes(segments[0])) {
    return true;
  }
  
  return false;
};

// Função para verificar se o usuário está autenticado
const isAuthenticated = (req: NextRequest) => {
  // Verificar se existe um token de sessão do NextAuth
  const sessionToken = req.cookies.get('next-auth.session-token')?.value || 
                     req.cookies.get('__Secure-next-auth.session-token')?.value;
  return !!sessionToken; // Retorna true se o token de sessão existir
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se a rota é pública (lista estática ou site público)
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  ) || isPublicSite(pathname);

  // Proteger APIs administrativas
  if (pathname.startsWith('/api/')) {
    // APIs públicas que não precisam de autenticação
    const publicApis = [
      '/api/posts', // GET para listar posts públicos
      '/api/categories', // GET para listar categorias
      '/api/auth', // Rotas de autenticação
    ];
    
    // Verificar se é uma API pública ou um método GET para APIs públicas
    const isPublicApi = publicApis.some(api => pathname.startsWith(api)) && request.method === 'GET';
    
    // Se for uma API de autenticação, permitir acesso
    if (pathname.startsWith('/api/auth')) {
      return NextResponse.next();
    }
    
    // Se for uma API pública com método GET, permitir acesso
    if (isPublicApi) {
      return NextResponse.next();
    }
    
    // Se for uma API administrativa e o usuário não estiver autenticado, retornar erro
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    
    // Se o usuário estiver autenticado, permitir acesso à API
    return NextResponse.next();
  }

  // Se for uma rota pública ou do site público, permitir o acesso
  if (isPublicPath) {
    // Se o usuário já estiver autenticado e tentar acessar a página de login, redirecionar para o dashboard
    if (pathname === '/login' && isAuthenticated(request)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Se não for uma rota pública e o usuário não estiver autenticado, redirecionar para o login
  if (!isAuthenticated(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se o usuário estiver autenticado, permitir o acesso à rota solicitada
  return NextResponse.next();
}

// Configuração para definir em quais rotas o middleware será executado
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
