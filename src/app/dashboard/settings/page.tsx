'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Settings, Globe, Bell, Shield, User, Menu, Image as ImageIcon, MessageCircle, Mail, MessageSquare, MapPin, Phone, Code } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

type SettingCard = {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
};

const settingsCards: SettingCard[] = [
  {
    title: 'HTML Personalizado',
    description: 'Adicione códigos HTML personalizados ao seu site',
    href: '/dashboard/settings/custom-html',
    icon: <Code className="h-6 w-6" />,
    color: 'bg-emerald-500/10 text-emerald-500',
  },
  {
    title: 'Temas',
    description: 'Personalize a aparência do seu blog',
    href: '/dashboard/settings/themes',
    icon: <Palette className="h-6 w-6" />,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Email',
    description: 'Configure SMTP e formulário de contato',
    href: '/dashboard/settings/email',
    icon: <Mail className="h-6 w-6" />,
    color: 'bg-cyan-500/10 text-cyan-500',
  },
  {
    title: 'WhatsApp',
    description: 'Configure o botão flutuante de WhatsApp',
    href: '/dashboard/settings/whatsapp',
    icon: <MessageSquare className="h-6 w-6" />,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Endereço',
    description: 'Configure o endereço do seu negócio',
    href: '/dashboard/settings/address',
    icon: <MapPin className="h-6 w-6" />,
    color: 'bg-orange-500/10 text-orange-500',
  },
  {
    title: 'Contato',
    description: 'Configure os dados de contato',
    href: '/dashboard/settings/contact',
    icon: <Phone className="h-6 w-6" />,
    color: 'bg-purple-500/10 text-purple-500',
  },
  {
    title: 'Geral',
    description: 'Configurações básicas do blog',
    href: '/dashboard/settings/general',
    icon: <Settings className="h-6 w-6" />,
    color: 'bg-blue-500/10 text-blue-500',
  },
  {
    title: 'WhatsApp',
    description: 'Configure o botão flutuante de WhatsApp',
    href: '/dashboard/settings/general#whatsapp',
    icon: <MessageCircle className="h-6 w-6" />,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Slider',
    description: 'Crie e gerencie banners e sliders',
    href: '/dashboard/settings/slider',
    icon: <ImageIcon className="h-6 w-6" />,
    color: 'bg-pink-500/10 text-pink-500',
  },
  {
    title: 'Menus',
    description: 'Configure os menus do seu site',
    href: '/dashboard/settings/menus',
    icon: <Menu className="h-6 w-6" />,
    color: 'bg-indigo-500/10 text-indigo-500',
  },
  {
    title: 'SEO',
    description: 'Otimização para motores de busca',
    href: '/dashboard/settings/seo',
    icon: <Globe className="h-6 w-6" />,
    color: 'bg-green-500/10 text-green-500',
  },
  {
    title: 'Notificações',
    description: 'Gerencie alertas e notificações',
    href: '/dashboard/settings/notifications',
    icon: <Bell className="h-6 w-6" />,
    color: 'bg-amber-500/10 text-amber-500',
  },
  {
    title: 'Segurança',
    description: 'Proteção e permissões de acesso',
    href: '/dashboard/settings/security',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-red-500/10 text-red-500',
  },
  {
    title: 'Perfil',
    description: 'Edite suas informações pessoais',
    href: '/dashboard/profile',
    icon: <User className="h-6 w-6" />,
    color: 'bg-sky-500/10 text-sky-500',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie as configurações do seu blog e personalize sua experiência.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settingsCards.map((card) => (
          <Link key={card.title} href={card.href} className="block">
            <Card className="h-full transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={cn("rounded-lg p-2", card.color)}>
                    {card.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {card.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: card.href === '/dashboard/settings/themes' ? '100%' : '0%' 
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {card.href === '/dashboard/settings/themes' ? 'Configurado' : 'Não configurado'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
