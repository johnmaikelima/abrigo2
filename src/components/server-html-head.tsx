// Componente para renderizar HTML no head
import Script from 'next/script';
import { parse } from 'node-html-parser';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ServerHtmlHeadProps {
  metaTags: string;
  scripts: string;
  rawHtml: string; // HTML bruto para renderização direta
}

// Função para extrair elementos HTML e convertê-los para React nodes
function extractHeadElements(html: string): React.ReactNode[] {
  if (!html) return [];
  
  try {
    const root = parse(html);
    const elements: React.ReactNode[] = [];
    
    // Extrair meta tags
    const metaTags = root.querySelectorAll('meta');
    metaTags.forEach((tag, index) => {
      const attrs: Record<string, string> = {};
      Object.entries(tag.attributes).forEach(([key, value]) => {
        attrs[key] = value as string;
      });
      elements.push(<meta key={`meta-${index}`} {...attrs} />);
    });
    
    // Extrair scripts
    const scripts = root.querySelectorAll('script');
    scripts.forEach((script, index) => {
      const attrs: Record<string, string> = {};
      Object.entries(script.attributes).forEach(([key, value]) => {
        attrs[key] = value as string;
      });
      
      // Usar o componente Script do Next.js para scripts externos
      if (attrs.src) {
        elements.push(
          <Script 
            key={`script-${index}`} 
            src={attrs.src} 
            strategy="beforeInteractive"
            {...attrs} 
          />
        );
      } else if (script.textContent) {
        // Para scripts inline
        elements.push(
          <Script 
            key={`script-inline-${index}`} 
            id={`custom-script-${index}`}
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: script.textContent }}
            {...attrs}
          />
        );
      }
    });
    
    // Extrair links (CSS, favicon, etc)
    const links = root.querySelectorAll('link');
    links.forEach((link, index) => {
      const attrs: Record<string, string> = {};
      Object.entries(link.attributes).forEach(([key, value]) => {
        attrs[key] = value as string;
      });
      elements.push(<link key={`link-${index}`} {...attrs} />);
    });
    
    return elements;
  } catch (error) {
    console.error('Erro ao extrair elementos do head:', error);
    return [];
  }
}

export function ServerHtmlHead({ metaTags, scripts, rawHtml }: ServerHtmlHeadProps) {
  // Não extraímos elementos aqui para evitar diferenças entre servidor e cliente
  // Vamos apenas renderizar scripts que injetarão o conteúdo no cliente
  
  return (
    <>
      {/* Renderizar meta tags usando um script que executa após a interatividade */}
      {metaTags && (
        <Script
          id="custom-head-meta"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Esta função é executada apenas no cliente
              (function() {
                var metaString = ${JSON.stringify(metaTags)};
                
                // No cliente, injetamos os elementos no head
                if (typeof window !== 'undefined') {
                  var fragment = document.createRange().createContextualFragment(metaString);
                  document.head.appendChild(fragment);
                }
              })();
            `
          }}
        />
      )}
      
      {/* Renderizar scripts usando um script que executa após a interatividade */}
      {scripts && (
        <Script
          id="custom-head-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var scriptString = ${JSON.stringify(scripts)};
                
                if (typeof window !== 'undefined') {
                  var fragment = document.createRange().createContextualFragment(scriptString);
                  document.head.appendChild(fragment);
                }
              })();
            `
          }}
        />
      )}
    </>
  );
}
