// Componente para renderizar HTML no body
import Script from 'next/script';

interface ServerHtmlBodyProps {
  scripts: string;
  otherElements: string;
}

export function ServerHtmlBody({ scripts, otherElements }: ServerHtmlBodyProps) {
  return (
    <>
      {/* Não renderizamos elementos HTML diretamente para evitar erros de hidratação */}
      {otherElements && (
        <Script
          id="custom-body-elements-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var elementsString = ${JSON.stringify(otherElements)};
                
                if (typeof window !== 'undefined') {
                  var div = document.createElement('div');
                  div.id = 'custom-body-elements';
                  div.innerHTML = elementsString;
                  document.body.appendChild(div);
                }
              })();
            `
          }}
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
