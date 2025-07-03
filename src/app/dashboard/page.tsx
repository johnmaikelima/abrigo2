'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Folder, Bot, BarChart2, Plus, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type StatCard = {
  title: string;
  value: string;
  icon: React.ElementType;
  href: string;
  description?: string;
  variant?: 'default' | 'outline';
};

export default function DashboardPage() {
  const stats: StatCard[] = [
    {
      title: 'Artigos',
      value: '0',
      icon: FileText,
      href: '/dashboard/posts',
      description: 'Gerencie suas publicações',
    },
    {
      title: 'Categorias',
      value: '0',
      icon: Folder,
      href: '/dashboard/categories',
      description: 'Organize por categorias',
    },
    {
      title: 'Usuários',
      value: '1',
      icon: Users,
      href: '/dashboard/users',
      description: 'Gerencie contas de usuários',
    },
    {
      title: 'Configurações',
      value: 'Ajustes',
      icon: Settings,
      href: '/dashboard/settings',
      description: 'Personalize o painel',
      variant: 'outline',
    },
  ];

  const quickActions = [
    {
      title: 'Novo Artigo',
      icon: Plus,
      href: '/dashboard/posts/new',
      description: 'Crie um novo post',
    },
    {
      title: 'Análises',
      icon: BarChart2,
      href: '/dashboard/analytics',
      description: 'Veja as métricas',
    },
    {
      title: 'IA Assistente',
      icon: Bot,
      href: '/dashboard/ai',
      description: 'Gere conteúdo com IA',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta ao painel de controle do seu blog.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Link key={i} href={stat.href} className="group block">
            <Card 
              className={cn(
                'h-full transition-all duration-200',
                stat.variant === 'outline' 
                  ? 'border-dashed hover:border-primary/50' 
                  : 'hover:shadow-md'
              )}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nenhuma atividade recente.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>SEO Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure o SEO nas configurações do site.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} className="group block">
              <Card className="h-full transition-all duration-200 hover:shadow-md">
                <CardHeader className="flex flex-row items-center space-x-4">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">
                      {action.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
