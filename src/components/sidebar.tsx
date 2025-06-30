'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Folder, Settings, BarChart, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Visão Geral',
      href: '/dashboard',
      icon: Home,
    },
    {
      name: 'Artigos',
      href: '/dashboard/artigos',
      icon: FileText,
    },
    {
      name: 'Categorias',
      href: '/dashboard/categorias',
      icon: Folder,
    },
    {
      name: 'Gerar Conteúdo',
      href: '/dashboard/ia',
      icon: Bot,
    },
    {
      name: 'Estatísticas',
      href: '/dashboard/estatisticas',
      icon: BarChart,
    },
    {
      name: 'Configurações',
      href: '/dashboard/configuracoes',
      icon: Settings,
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Painel Admin</h1>
          </div>
          <div className="flex flex-col flex-1 mt-5">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? 'text-gray-500 dark:text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
