import React from 'react';
import { Metadata } from 'next';
import SliderContainer from '@/components/slider-container';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Demonstração de Slider',
  description: 'Página de demonstração para visualizar sliders configurados no painel administrativo',
};

async function getSliders() {
  try {
    // Buscar todos os sliders disponíveis
    // Nota: Em ambiente de produção, você deve usar uma URL absoluta ou variáveis de ambiente
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/sliders`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar sliders');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar sliders:', error);
    return [];
  }
}

export default async function SliderDemoPage() {
  const sliders = await getSliders();
  
  return (
    <div className="container mx-auto py-8 space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Demonstração de Sliders</h1>
        <p className="text-muted-foreground mb-8">
          Esta página mostra os sliders configurados no painel administrativo.
        </p>
      </div>
      
      {sliders.length === 0 ? (
        <div className="text-center py-20 border rounded-lg border-dashed">
          <h2 className="text-xl font-medium mb-4">Nenhum slider encontrado</h2>
          <p className="text-muted-foreground mb-6">
            Você ainda não criou nenhum slider no painel administrativo.
          </p>
          <Button asChild>
            <Link href="/dashboard/settings/slider">Criar Slider</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-16">
          {sliders.map((slider: any) => (
            <div key={slider._id} className="space-y-4">
              <div className="border-b pb-2">
                <h2 className="text-2xl font-bold">{slider.name}</h2>
                {slider.description && (
                  <p className="text-muted-foreground">{slider.description}</p>
                )}
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="mr-4">Dimensões: {slider.width} × {slider.height}</span>
                  <span>Intervalo: {slider.interval}ms</span>
                </div>
              </div>
              
              <SliderContainer sliderId={slider._id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
