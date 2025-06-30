'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Save, Check, ArrowLeft, Palette, Layout, Type, Image } from 'lucide-react';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

// Tipo para as configurações do tema
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

// Configurações padrão do tema
const defaultThemeSettings: ThemeSettings = {
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

export default function ThemesPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('colors');

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemeSettings();
  }, []);

  // Função para atualizar as configurações do tema
  const handleSaveThemeSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/theme-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(themeSettings),
      });

      if (response.ok) {
        alert('Configurações do tema salvas com sucesso!');
      } else {
        alert('Erro ao salvar configurações do tema.');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações do tema:', error);
      alert('Erro ao salvar configurações do tema.');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para atualizar as cores do tema
  const handleColorChange = (colorKey: keyof ThemeSettings['colors'], value: string) => {
    setThemeSettings({
      ...themeSettings,
      colors: {
        ...themeSettings.colors,
        [colorKey]: value,
      },
    });
  };

  // Função para atualizar as configurações do cabeçalho
  const handleHeaderChange = (key: keyof ThemeSettings['header'], value: unknown) => {
    setThemeSettings({
      ...themeSettings,
      header: {
        ...themeSettings.header,
        [key]: value,
      },
    });
  };

  // Função para atualizar as configurações do rodapé
  const handleFooterChange = (key: keyof ThemeSettings['footer'], value: unknown) => {
    setThemeSettings({
      ...themeSettings,
      footer: {
        ...themeSettings.footer,
        [key]: value,
      },
    });
  };

  // Função para atualizar as configurações de tipografia
  const handleTypographyChange = (key: keyof ThemeSettings['typography'], value: unknown) => {
    setThemeSettings({
      ...themeSettings,
      typography: {
        ...themeSettings.typography,
        [key]: value,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando configurações do tema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="p-0 h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Tema</h1>
          <p className="text-muted-foreground mt-1">
            Personalize a aparência do seu blog para seus leitores.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Cores</span>
          </TabsTrigger>
          <TabsTrigger value="header" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Cabeçalho</span>
          </TabsTrigger>
          <TabsTrigger value="footer" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            <span>Rodapé</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Tipografia</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cores do Tema</CardTitle>
              <CardDescription>
                Defina as cores principais do seu blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor Primária</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.colors.primary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('primary', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={themeSettings.colors.primary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor Secundária</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.colors.secondary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('secondary', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={themeSettings.colors.secondary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor de Fundo</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.colors.background}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('background', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={themeSettings.colors.background}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('background', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor do Texto</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.colors.text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('text', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={themeSettings.colors.text}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('text', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cor de Destaque</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={themeSettings.colors.accent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('accent', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={themeSettings.colors.accent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleColorChange('accent', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="header" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Cabeçalho</CardTitle>
              <CardDescription>
                Personalize o cabeçalho do seu blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mostrar Logo</label>
                <input
                  type="checkbox"
                  id="showLogo"
                  checked={themeSettings.header.showLogo}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange('showLogo', e.target.checked)}
                  className="mr-2"
                />
              </div>
              {themeSettings.header.showLogo && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL do Logo</label>
                  <Input
                    value={themeSettings.header.logoUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange('logoUrl', e.target.value)}
                    placeholder="/logo.png"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mostrar Navegação</label>
                <input
                  type="checkbox"
                  checked={themeSettings.header.showNavigation}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange('showNavigation', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Cabeçalho Fixo</label>
                <input
                  type="checkbox"
                  checked={themeSettings.header.sticky}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange('sticky', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Altura do Cabeçalho (px)</label>
                <Input
                  type="number"
                  value={themeSettings.header.height}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHeaderChange('height', parseInt(e.target.value))}
                  min="40"
                  max="200"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Rodapé</CardTitle>
              <CardDescription>
                Personalize o rodapé do seu blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mostrar Copyright</label>
                <input
                  type="checkbox"
                  checked={themeSettings.footer.showCopyright}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFooterChange('showCopyright', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
              {themeSettings.footer.showCopyright && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Texto do Copyright</label>
                  <Input
                    value={themeSettings.footer.copyrightText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFooterChange('copyrightText', e.target.value)}
                    placeholder="© 2025 Blog. Todos os direitos reservados."
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Mostrar Links Sociais</label>
                <input
                  type="checkbox"
                  checked={themeSettings.footer.showSocialLinks}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFooterChange('showSocialLinks', e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Tipografia</CardTitle>
              <CardDescription>
                Personalize as fontes do seu blog.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fonte dos Títulos</label>
                <select
                  value={themeSettings.typography.headingFont}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTypographyChange('headingFont', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fonte do Corpo</label>
                <select
                  value={themeSettings.typography.bodyFont}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTypographyChange('bodyFont', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Lato">Lato</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tamanho Base da Fonte (px)</label>
                <Input
                  type="number"
                  value={themeSettings.typography.baseFontSize}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTypographyChange('baseFontSize', parseInt(e.target.value))}
                  min="12"
                  max="24"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button
          onClick={handleSaveThemeSettings}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>Salvando...</>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Visualização</CardTitle>
          <CardDescription>
            Veja como seu blog ficará com as configurações atuais.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <div 
              className="p-4 flex items-center justify-between"
              style={{
                backgroundColor: themeSettings.colors.background,
                color: themeSettings.colors.text,
                height: `${themeSettings.header.height}px`,
                borderBottom: `1px solid ${themeSettings.colors.text}20`,
              }}
            >
              {themeSettings.header.showLogo && (
                <div className="font-bold" style={{ color: themeSettings.colors.primary }}>
                  Logo do Blog
                </div>
              )}
              {themeSettings.header.showNavigation && (
                <div className="flex items-center gap-4">
                  {themeSettings.header.navigationItems.slice(0, 4).map((item, index) => (
                    <div key={index} style={{ color: themeSettings.colors.text }}>
                      {item.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div 
              className="p-8"
              style={{
                backgroundColor: themeSettings.colors.background,
                color: themeSettings.colors.text,
                fontFamily: themeSettings.typography.bodyFont,
                fontSize: `${themeSettings.typography.baseFontSize}px`,
              }}
            >
              <h1 
                className="text-3xl font-bold mb-4" 
                style={{ 
                  color: themeSettings.colors.text,
                  fontFamily: themeSettings.typography.headingFont,
                }}
              >
                Título do Blog
              </h1>
              <p className="mb-4">
                Este é um exemplo de como seu blog ficará com as configurações atuais.
                Você pode personalizar as cores, o cabeçalho, o rodapé e a tipografia.
              </p>
              <button
                className="px-4 py-2 rounded"
                style={{
                  backgroundColor: themeSettings.colors.primary,
                  color: '#ffffff',
                }}
              >
                Botão Primário
              </button>
            </div>
            <div 
              className="p-4 grid grid-cols-3 gap-4"
              style={{
                backgroundColor: themeSettings.colors.text + '10',
                color: themeSettings.colors.text,
                borderTop: `1px solid ${themeSettings.colors.text}20`,
              }}
            >
              {themeSettings.footer.showCopyright && (
                <div className="col-span-3 text-center text-sm">
                  {themeSettings.footer.copyrightText}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
