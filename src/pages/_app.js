import { useEffect } from 'react';

// Componente personalizado para substituir o App padrão do Next.js
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Função para forçar a atualização do título
    const updateTitle = () => {
      // Verificar se o título contém localhost:3000
      if (document.title.includes('localhost:')) {
        // Buscar o título armazenado ou usar um padrão
        const storedTitle = localStorage.getItem('pageTitle') || 'Blog Moderno';
        document.title = storedTitle;
      }
    };
    
    // Executar imediatamente
    updateTitle();
    
    // Configurar um observador de mutação para detectar mudanças no título
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || 
            (document.title && document.title.includes('localhost:'))) {
          updateTitle();
        }
      });
    });
    
    // Observar mudanças no head do documento
    observer.observe(document.head, { 
      childList: true, 
      subtree: true 
    });
    
    // Também configurar um intervalo para verificar periodicamente
    const intervalId = setInterval(updateTitle, 500);
    
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
