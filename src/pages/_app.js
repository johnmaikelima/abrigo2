import '../styles/globals.css';
import React from 'react';

// Versão extremamente simplificada do App para evitar problemas de SSR
function MyApp({ Component, pageProps }) {
  // Verifica se a página atual solicitou para pular a renderização do App
  if (pageProps && pageProps.skipAppRender) {
    return <Component {...pageProps} />;
  }
  
  // Verifica se estamos em uma página de erro
  const isErrorPage = Component.displayName === 'ErrorPage' || 
                     Component.displayName === 'Custom404' || 
                     Component.displayName === 'Custom500' || 
                     Component.displayName === 'Error';

  // Para páginas de erro, renderiza apenas o componente sem nenhuma lógica adicional
  if (isErrorPage) {
    return <Component {...pageProps} />;
  }

  // Para páginas normais, renderiza com o ClientSideAppWrapper
  return (
    <>
      <Component {...pageProps} />
      {typeof window !== 'undefined' && <ClientSideLogic />}
    </>
  );
}

// Este componente só executa lógica no lado do cliente
function ClientSideLogic() {
  // No cliente, podemos usar React.useEffect com segurança
  React.useEffect(() => {
    // Função para atualizar o título com base no localStorage
    const updateTitle = () => {
      try {
        const storedTitle = localStorage.getItem('title');
        if (storedTitle) {
          document.title = storedTitle;
        }
      } catch (error) {
        // Silenciar erros em ambiente de produção
      }
    };

    // Atualiza o título inicialmente
    updateTitle();

    // Configura um observador para mudanças no título
    let observer;
    try {
      observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.target === document.head) {
            const titleElement = document.querySelector('title');
            if (titleElement) {
              try {
                localStorage.setItem('title', titleElement.textContent);
              } catch (error) {
                // Silenciar erros em ambiente de produção
              }
            }
          }
        });
      });

      // Inicia a observação
      observer.observe(document.head, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      // Silenciar erros em ambiente de produção
    }

    // Limpa o observador quando o componente é desmontado
    return () => {
      if (observer) {
        try {
          observer.disconnect();
        } catch (error) {
          // Silenciar erros em ambiente de produção
        }
      }
    };
  }, []);

  return null;
}

// Adiciona getInitialProps para garantir que o App seja executado no cliente
MyApp.getInitialProps = async (appContext) => {
  const appProps = {};
  
  // Se o componente da página tem getInitialProps, execute-o
  if (appContext.Component.getInitialProps) {
    appProps.pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  } else {
    appProps.pageProps = {};
  }
  
  return appProps;
};

export default MyApp;
