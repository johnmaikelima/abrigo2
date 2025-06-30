'use client';

import { ReactNode, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type SiteLayoutProps = {
  children: ReactNode;
};

type ThemeSettings = {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
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
  footer: {
    showCopyright: boolean;
    copyrightText: string;
    showSocialLinks: boolean;
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    columns: Array<{
      title: string;
      links: Array<{
        label: string;
        url: string;
        isExternal: boolean;
      }>;
    }>;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: number;
  };
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);

  // Carregar configurações do tema
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        if (response.ok) {
          const data = await response.json();
          setThemeSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error);
      }
    };

    fetchThemeSettings();
    setMounted(true);
  }, []);

  // Configurações padrão do tema
  const defaultSettings: ThemeSettings = {
    colors: {
      primary: '#2563eb',
      secondary: '#10b981',
      background: '#ffffff',
      text: '#111827',
      accent: '#f59e0b',
    },
    header: {
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
    },
    footer: {
      showCopyright: true,
      copyrightText: '© 2025 Blog. Todos os direitos reservados.',
      showSocialLinks: true,
      socialLinks: [
        { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
        { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
        { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
      ],
      columns: [
        {
          title: 'Links Úteis',
          links: [
            { label: 'Home', url: '/', isExternal: false },
            { label: 'Blog', url: '/blog', isExternal: false },
            { label: 'Sobre', url: '/sobre', isExternal: false },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Termos de Uso', url: '/termos', isExternal: false },
            { label: 'Privacidade', url: '/privacidade', isExternal: false },
          ],
        },
      ],
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      baseFontSize: 16,
    },
  };

  // Use as configurações do tema ou as configurações padrão
  const settings = themeSettings || defaultSettings;

  // Evitar problemas de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <div 
      style={{ 
        backgroundColor: settings.colors.background,
        color: settings.colors.text,
        fontFamily: settings.typography.bodyFont,
        fontSize: `${settings.typography.baseFontSize}px`,
      }}
    >
      <main style={{ minHeight: 'calc(100vh - 80px - 300px)' }}>
        {children}
      </main>
    </div>
  );
}
