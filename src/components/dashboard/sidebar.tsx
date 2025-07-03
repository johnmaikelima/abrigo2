'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Home, FileText, Settings, Users, LogOut, ChevronDown, Palette, ChevronRight, Tag, Sparkles, Layout, Image, Globe } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type NavItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
  submenu?: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
};

const navItems: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: 'Posts',
    href: '/dashboard/posts',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    name: 'Páginas',
    href: '/dashboard/pages',
    icon: <Layout className="h-5 w-5" />,
  },
  {
    name: 'Categorias',
    href: '/dashboard/categories',
    icon: <Tag className="h-5 w-5" />,
  },
  {
    name: 'IA',
    href: '/dashboard/ai',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    name: 'Usuários',
    href: '/dashboard/users',
    icon: <Users className="h-5 w-5" />,
  },
  {
    name: 'Configurações',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        name: 'Página Inicial',
        href: '/dashboard/settings/homepage',
        icon: <Globe className="h-4 w-4" />,
      },
      {
        name: 'Menus',
        href: '/dashboard/settings/menus',
        icon: <Layout className="h-4 w-4" />,
      },
      {
        name: 'Temas',
        href: '/dashboard/settings/themes',
        icon: <Palette className="h-4 w-4" />,
      },
      {
        name: 'Slider',
        href: '/dashboard/settings/slider',
        icon: <Image className="h-4 w-4" />,
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>('/dashboard/settings');

  const toggleSubmenu = (href: string) => {
    setOpenSubmenu(openSubmenu === href ? null : href);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', height: '64px', padding: '0 24px', borderBottom: '1px solid #e5e7eb' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
          <span style={{ fontSize: '18px' }}>Blog Admin</span>
        </Link>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        <nav>
          {navItems.map((item) => (
            <div key={item.href}>
              {item.submenu ? (
                <div>
                  <div style={{ display: 'flex' }}>
                    <Link
                      href={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 0 12px 24px',
                        color: pathname === item.href ? '#2563eb' : '#4b5563',
                        backgroundColor: pathname.startsWith(item.href) ? '#f3f4f6' : 'transparent',
                        transition: 'all 0.2s',
                        flexGrow: 1
                      }}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                    <button
                      onClick={() => toggleSubmenu(item.href)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '12px 24px',
                        color: pathname.startsWith(item.href) ? '#2563eb' : '#4b5563',
                        backgroundColor: pathname.startsWith(item.href) ? '#f3f4f6' : 'transparent',
                        transition: 'all 0.2s',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {openSubmenu === item.href ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {openSubmenu === item.href && (
                    <div style={{ paddingLeft: '24px' }}>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '10px 24px',
                            color: pathname === subItem.href ? '#2563eb' : '#4b5563',
                            backgroundColor: pathname === subItem.href ? '#f3f4f6' : 'transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          {subItem.icon}
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 24px',
                    color: pathname === item.href ? '#2563eb' : '#4b5563',
                    backgroundColor: pathname === item.href ? '#f3f4f6' : 'transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}
