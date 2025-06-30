'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface ForceTitleProps {
  title: string;
}

/**
 * Componente que força a definição do título da página usando diferentes abordagens
 */
export default function ForceTitle({ title }: ForceTitleProps) {
  useEffect(() => {
    if (title) {
      // Definir o título diretamente
      document.title = title;
      
      // Remover qualquer elemento title existente
      const existingTitles = document.querySelectorAll('title');
      existingTitles.forEach(el => el.remove());
      
      // Criar um novo elemento title
      const newTitle = document.createElement('title');
      newTitle.textContent = title;
      document.head.appendChild(newTitle);
      
      // Verificar periodicamente se o título foi alterado
      const intervalId = setInterval(() => {
        if (document.title !== title || document.title.includes('localhost:')) {
          document.title = title;
        }
      }, 100);
      
      return () => clearInterval(intervalId);
    }
  }, [title]);
  
  // Injetar um script inline que define o título
  return (
    <>
      <Script id="force-title" strategy="beforeInteractive">
        {`
          (function() {
            try {
              // Definir o título diretamente
              document.title = "${title.replace(/"/g, '\\"')}";
              
              // Observar mudanças no título
              const observer = new MutationObserver(function(mutations) {
                if (document.title !== "${title.replace(/"/g, '\\"')}" || 
                    document.title.includes('localhost:')) {
                  document.title = "${title.replace(/"/g, '\\"')}";
                }
              });
              
              // Observar mudanças no head
              observer.observe(document.head, { 
                childList: true, 
                subtree: true 
              });
            } catch(e) {
              console.error('Erro ao definir título:', e);
            }
          })();
        `}
      </Script>
    </>
  );
}
