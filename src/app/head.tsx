'use client';

import { useEffect } from 'react';

export default function Head() {
  useEffect(() => {
    // Função para forçar a atualização do título
    const forceUpdateTitle = () => {
      // Buscar o título da página da localStorage (será definido pela página)
      const pageTitle = localStorage.getItem('pageTitle') || 'Blog Moderno';
      
      // Forçar a atualização do título
      document.title = pageTitle;
      
      // Verificar se o título ainda contém o URL
      if (document.title.includes('localhost:')) {
        document.title = pageTitle;
      }
    };
    
    // Executar imediatamente
    forceUpdateTitle();
    
    // Configurar um intervalo para verificar e atualizar o título periodicamente
    const intervalId = setInterval(forceUpdateTitle, 100);
    
    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, []);
  
  return null;
}
