'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { RefreshCw, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

export default function SEOSettingsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  const generateSitemap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/sitemap/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao gerar sitemap');
      }

      toast.success('Sitemap gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar sitemap:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao gerar sitemap');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações de SEO</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sitemap XML</CardTitle>
            <CardDescription>
              O sitemap.xml ajuda os motores de busca a indexar seu site mais eficientemente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              O sitemap é atualizado automaticamente sempre que um novo post é publicado, 
              mas você também pode atualizá-lo manualmente clicando no botão abaixo.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-500">URL do Sitemap:</span>
              <Link 
                href={sitemapUrl} 
                target="_blank" 
                className="text-blue-600 hover:underline text-sm"
              >
                {sitemapUrl}
              </Link>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => window.open(sitemapUrl, '_blank')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Ver Sitemap
            </Button>
            <Button 
              onClick={generateSitemap} 
              disabled={isGenerating}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Gerando...' : 'Atualizar Sitemap'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dicas de SEO</CardTitle>
            <CardDescription>
              Recomendações para melhorar o SEO do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use títulos descritivos e relevantes para seus posts</li>
              <li>Inclua palavras-chave importantes no início do conteúdo</li>
              <li>Adicione meta descrições para todos os posts</li>
              <li>Use URLs amigáveis e descritivas</li>
              <li>Otimize as imagens com texto alternativo</li>
              <li>Crie conteúdo de qualidade e original</li>
              <li>Mantenha o site rápido e responsivo</li>
              <li>Use links internos para conectar conteúdos relacionados</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
