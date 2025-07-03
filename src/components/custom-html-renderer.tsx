'use client';

import { useEffect, useRef } from 'react';

interface CustomHtmlRendererProps {
  html: string;
  location: 'head' | 'body';
}

export function CustomHtmlRenderer({ html, location }: CustomHtmlRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Usar useEffect para evitar erros de hidratação
  useEffect(() => {
    if (!html || !containerRef.current) return;
    
    // Limpar o conteúdo atual
    containerRef.current.innerHTML = '';
    
    try {
      // Criar um elemento temporário para analisar o HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Adicionar cada elemento ao container
      Array.from(tempDiv.children).forEach(child => {
        containerRef.current?.appendChild(child);
      });
    } catch (e) {
      console.error(`Erro ao renderizar HTML personalizado (${location}):`, e);
    }
  }, [html, location]);
  
  // Renderizar um div vazio que será preenchido pelo useEffect
  return <div ref={containerRef} data-custom-html={location} suppressHydrationWarning />;
}
