"use client";

// Componente para renderizar HTML no body
import Script from 'next/script';

interface ServerHtmlBodyProps {
  scripts: string;
  otherElements: string;
}

export function ServerHtmlBody({ scripts, otherElements }: ServerHtmlBodyProps) {
  return (
    <>
      {/* Renderizar elementos HTML estáticos */}
      {otherElements && (
        <div 
          id="custom-body-elements"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: otherElements }}
        />
      )}
      
      {/* Renderizar scripts usando um script que executa após a interatividade */}
      {scripts && (
        <Script
          id="custom-body-scripts"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var scriptString = ${JSON.stringify(scripts)};
                
                if (typeof window !== 'undefined') {
                  var fragment = document.createRange().createContextualFragment(scriptString);
                  document.body.appendChild(fragment);
                }
              })();
            `
          }}
        />
      )}
    </>
  );
}
