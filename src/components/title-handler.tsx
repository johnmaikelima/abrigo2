'use client';

import { useEffect } from 'react';

interface TitleHandlerProps {
  title: string;
}

/**
 * Componente que atualiza o título da página diretamente no DOM
 * Isso contorna qualquer problema com o sistema de metadados do Next.js
 */
export default function TitleHandler({ title }: TitleHandlerProps) {
  useEffect(() => {
    // Atualiza o título da página diretamente
    if (title) {
      try {
        // Armazenar o título no localStorage para que o componente head.tsx possa acessá-lo
        localStorage.setItem('pageTitle', title);
        
        // Força a atualização do título e garante que não tenha o URL
        document.title = title;
        
        // Adiciona um pequeno atraso para garantir que o título seja definido
        // mesmo após qualquer atualização do Next.js
        const timeoutId = setTimeout(() => {
          // Verifica se o título ainda contém o URL ou não foi definido corretamente
          if (document.title.includes('localhost:') || document.title !== title) {
            document.title = title;
            
            // Tenta remover qualquer elemento title existente e adicionar um novo
            const existingTitleElements = document.getElementsByTagName('title');
            if (existingTitleElements.length > 0) {
              // Remover todos os elementos title existentes
              for (let i = existingTitleElements.length - 1; i >= 0; i--) {
                existingTitleElements[i].remove();
              }
            }
            
            // Adicionar um novo elemento title
            const newTitle = document.createElement('title');
            newTitle.textContent = title;
            document.head.appendChild(newTitle);
          }
        }, 100);
        
        // Configurar um intervalo para verificar e atualizar o título periodicamente
        const intervalId = setInterval(() => {
          if (document.title.includes('localhost:') || document.title !== title) {
            document.title = title;
          }
        }, 500);
        
        return () => {
          clearTimeout(timeoutId);
          clearInterval(intervalId);
        };
      } catch (error) {
        // Em caso de erro (por exemplo, localStorage não disponível), apenas define o título
        document.title = title;
      }
    }
  }, [title]);

  // Este componente não renderiza nada visível
  return null;
}
