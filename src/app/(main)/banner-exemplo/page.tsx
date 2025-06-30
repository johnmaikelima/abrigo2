'use client';

import { useState, useEffect } from 'react';
import SliderContainer from '@/components/slider-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function BannerExemploPage() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSliderId, setSelectedSliderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/sliders');
        
        if (response.ok) {
          const data = await response.json();
          setSliders(data);
          // Seleciona o primeiro slider por padrão, se existir
          if (data.length > 0) {
            setSelectedSliderId(data[0]._id);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar sliders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Exemplo de Banner Abaixo do Menu</h1>
      
      {/* Área de visualização do banner */}
      <div className="mb-10 bg-gray-50 p-4 border rounded-lg">
        <div className="text-sm text-gray-500 mb-2">↓ Banner aparecerá abaixo do menu ↓</div>
        
        {loading ? (
          <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : selectedSliderId ? (
          <SliderContainer sliderId={selectedSliderId} />
        ) : (
          <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">Nenhum slider disponível</p>
          </div>
        )}
      </div>
      
      {/* Seletor de banners */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione um banner para visualizar</CardTitle>
          <CardDescription>
            Escolha entre os banners disponíveis para ver como ficará na página
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sliders.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Nenhum slider disponível. Crie um slider no painel administrativo.
            </p>
          ) : (
            <div className="grid gap-2">
              {sliders.map((slider) => (
                <Button
                  key={slider._id}
                  variant={selectedSliderId === slider._id ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedSliderId(slider._id)}
                >
                  <span className="truncate">{slider.name}</span>
                  <span className="ml-2 text-xs opacity-70">
                    ({slider.images.length} imagens)
                  </span>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Explicação */}
      <div className="mt-10 bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-3">Como implementar este banner no seu site</h2>
        <p className="mb-4">
          Para adicionar este banner abaixo do menu em todas as páginas do seu site, 
          você precisará modificar o arquivo de layout principal.
        </p>
        
        <div className="bg-white p-4 rounded-md mb-4 overflow-x-auto">
          <pre className="text-sm">
            <code>{`// Em src/app/(main)/layout.tsx

export default async function MainSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ...código existente...
  
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Header categories={categories} blogSettings={blogSettings} />
      
      {/* Banner abaixo do menu */}
      <div className="pt-24 w-full">
        <SliderContainer sliderId="ID-DO-SEU-SLIDER" />
      </div>
      
      <main className="flex-grow w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
      <Footer blogSettings={blogSettings} />
    </div>
  );
}`}</code>
          </pre>
        </div>
        
        <p>
          Depois de implementar, você poderá controlar o banner através do painel administrativo,
          alterando imagens, textos e links sem precisar modificar o código.
        </p>
      </div>
    </div>
  );
}
