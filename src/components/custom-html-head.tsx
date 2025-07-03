'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface CustomHtmlHeadProps {
  htmlContent: string;
}

/**
 * Componente do lado do cliente para renderizar HTML personalizado no head
 * Usa um efeito para inserir o HTML apenas no cliente, evitando erros de hidratação
 */
export default function CustomHtmlHead({ htmlContent }: CustomHtmlHeadProps) {
  // Se não houver conteúdo, não renderiza nada
  if (!htmlContent) return null;

  return (
    <>
      {/* Usar Script para conteúdo que precisa ser executado */}
      <Script
        id="custom-head-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            try {
              ${htmlContent}
            } catch (e) {
              console.error('Erro ao executar HTML personalizado no head:', e);
            }
          `
        }}
      />
    </>
  );
}
