'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type HeaderProps = {
  themeSettings?: {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    header: {
      showLogo: boolean;
      logoUrl: string;
      showNavigation: boolean;
      navigationItems: Array<{
        label: string;
        url: string;
        isExternal: boolean;
      }>;
      sticky: boolean;
      height: number;
    };
  };
};

export default function SiteHeader({ themeSettings }: HeaderProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<HeaderProps['themeSettings']>();

  // Carregar configurações do tema
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error);
      }
    };

    fetchThemeSettings();
    setMounted(true);
  }, []);

  // Use as configurações fornecidas ou as configurações padrão
  const headerSettings = settings?.header || themeSettings?.header || {
    showLogo: true,
    logoUrl: '/logo.png',
    showNavigation: true,
    navigationItems: [
      { label: 'Home', url: '/', isExternal: false },
      { label: 'Blog', url: '/blog', isExternal: false },
      { label: 'Sobre', url: '/sobre', isExternal: false },
      { label: 'Contato', url: '/contato', isExternal: false },
    ],
    sticky: true,
    height: 80,
  };

  const colors = settings?.colors || themeSettings?.colors || {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827',
  };

  // Evitar problemas de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <header
      style={{
        backgroundColor: colors.background,
        color: colors.text,
        height: `${headerSettings.height}px`,
        position: headerSettings.sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${colors.text}10`,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="container mx-auto flex items-center justify-between">
        {headerSettings.showLogo && (
          <Link href="/">
            <div className="flex items-center gap-2">
              <img 
                src={headerSettings.logoUrl} 
                alt="Logo" 
                className="h-8 w-auto"
                onError={(e) => {
                  // Se a imagem não carregar, mostrar um texto como fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span style={{ color: colors.primary, fontWeight: 'bold', fontSize: '1.5rem' }}>
                Blog
              </span>
            </div>
          </Link>
        )}

        {headerSettings.showNavigation && (
          <nav>
            <ul className="flex items-center gap-6">
              {headerSettings.navigationItems.map((item, index) => (
                <li key={index}>
                  {item.isExternal ? (
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: colors.text }}
                      className="hover:underline"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link 
                      href={item.url}
                      style={{ color: colors.text }}
                      className="hover:underline"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
              <li>
                <Link 
                  href="/dashboard"
                  style={{ 
                    backgroundColor: colors.primary,
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.375rem',
                  }}
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
