'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Componente de botão WhatsApp fixo que será sempre exibido na página inicial
 * Este componente é uma versão simplificada do WhatsAppButton que ignora configurações
 * e sempre exibe o botão
 */
export default function WhatsAppFixedButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Efeito para montar o componente e adicionar estilos globais
  useEffect(() => {
    setIsMounted(true);
    console.log('WhatsApp Fixed Button montado');
    
    // Adicionar estilos globais para garantir que o botão seja exibido
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .whatsapp-fixed-button {
        position: fixed !important;
        bottom: 20px !important;
        right: 20px !important;
        z-index: 99999 !important;
        visibility: visible !important;
        opacity: 1 !important;
        display: block !important;
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Forçar visibilidade após montagem
    const forceVisibility = () => {
      // Selecionar o botão fixo específico
      const fixedButton = document.getElementById('whatsapp-fixed-button');
      if (fixedButton) {
        fixedButton.style.visibility = 'visible';
        fixedButton.style.opacity = '1';
        fixedButton.style.zIndex = '99999';
        fixedButton.style.display = 'block';
        fixedButton.style.position = 'fixed';
        console.log('Botão WhatsApp fixo forçado a ficar visível');
      } else {
        console.log('Botão WhatsApp fixo não encontrado no DOM');
      }
    };
    
    // Executar várias vezes para garantir que o botão seja exibido
    forceVisibility();
    const timers = [
      setTimeout(forceVisibility, 100),
      setTimeout(forceVisibility, 500),
      setTimeout(forceVisibility, 1000),
      setTimeout(forceVisibility, 2000),
      setTimeout(forceVisibility, 3000),
      setTimeout(forceVisibility, 5000)
    ];
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Se não estiver montado, renderiza um placeholder para garantir que o elemento exista no DOM
  if (!isMounted) {
    return (
      <div id="whatsapp-fixed-button" className="whatsapp-fixed-button" style={{ visibility: 'hidden' }}>
        Carregando botão de WhatsApp...
      </div>
    );
  }
  
  // Número e mensagem padrão
  const number = '5511999999999';
  const message = 'Olá! Vim pelo site e gostaria de algumas informações.';
  const hoverText = 'Precisa de ajuda? Fale conosco!';
  
  // Formatar a URL do WhatsApp corretamente
  const formattedNumber = number.startsWith('55') ? number : `55${number}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message)}`;
  
  return (
    <div 
      id="whatsapp-fixed-button"
      className="whatsapp-fixed-button"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        visibility: 'visible',
        opacity: 1,
        display: 'block'
      }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#25D366] hover:bg-[#20BA5C] text-white p-4 rounded-full transition-all duration-300 relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ display: 'block' }}
      >
        {/* Ícone do WhatsApp */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          className="h-6 w-6 fill-current"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
        
        {/* Tooltip */}
        {isHovered && (
          <div 
            className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md whitespace-nowrap"
            style={{ zIndex: 99999 }}
          >
            <div className="relative">
              <div className="text-sm font-medium whitespace-nowrap">{hoverText}</div>
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
            </div>
          </div>
        )}
      </a>
    </div>
  );
}
