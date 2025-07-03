'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Lock, Mail } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

// Componente LoginForm que usa useSearchParams
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';
  const error = searchParams?.get('error');
  
  // Verificar se existe algum administrador
  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch('/api/admin/check');
        const data = await response.json();
        setHasAdmin(data.hasAdmin);
      } catch (error) {
        console.error('Erro ao verificar administrador:', error);
      } finally {
        setIsChecking(false);
      }
    }
    
    checkAdmin();
  }, []);

  // Exibir mensagem de erro se houver
  if (error) {
    toast.error('Credenciais inválidas. Tente novamente.');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    console.log('Iniciando processo de login...');
    setIsLoading(true);
    
    try {
      console.log('Chamando signIn com as credenciais...');
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });
      
      console.log('Resposta do signIn:', result);
      
      if (result?.error) {
        console.error('Erro durante o login:', result.error);
        throw new Error(result.error);
      }
      
      if (result?.url) {
        console.log('Redirecionando para:', result.url);
        router.push(result.url);
      } else {
        console.log('Redirecionando para a página padrão:', callbackUrl);
        router.push(callbackUrl);
      }
      
      // Forçar atualização da página para garantir que a sessão seja carregada
      router.refresh();
      
    } catch (error) {
      console.error('Erro durante o login:', error);
      toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Faça login para acessar o painel
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          {/* Link para configuração inicial se não houver administrador */}
          {!isChecking && !hasAdmin && (
            <div className="text-center mt-4">
              <Link 
                href="/setup" 
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Configuração inicial do sistema
              </Link>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Crie o primeiro usuário administrador
              </p>
            </div>
          )}
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

// Componente de fallback para o Suspense
function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Painel Administrativo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Carregando...
          </p>
        </div>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-10 bg-blue-200 dark:bg-blue-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Componente principal da página que usa Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
