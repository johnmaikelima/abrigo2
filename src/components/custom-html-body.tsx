'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface CustomHtmlBodyProps {
  htmlContent: string;
}

/**
 * Componente do lado do cliente para renderizar HTML personalizado no body
 * Usa um efeito para inserir o HTML apenas no cliente, evitando erros de hidratação
 */
export default function CustomHtmlBody({ htmlContent }: CustomHtmlBodyProps) {
  // Se não houver conteúdo, não renderiza nada
  if (!htmlContent) return null;

  return (
    <>
      {/* Usar Script para conteúdo que precisa ser executado */}
      <Script
        id="custom-body-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              ${htmlContent}
            } catch (e) {
              console.error('Erro ao executar HTML personalizado no body:', e);
            }
          `
        }}
      />
    </>
  );
}
