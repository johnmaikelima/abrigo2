'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WhatsAppButtonProps {
  number: string;
  message: string;
  hoverText: string;
  enabled: boolean;
}

export default function WhatsAppButton({ number, message, hoverText, enabled }: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [fetchedConfig, setFetchedConfig] = useState<any>(null);

  // Efeito para buscar configurações do WhatsApp diretamente se não forem fornecidas
  useEffect(() => {
    setIsMounted(true);
    console.log('WhatsApp Button montado:', { number, message, hoverText, enabled });
    
    // Se não tiver número ou estiver desabilitado, tenta buscar configurações da API
    if (!number || !enabled) {
      const fetchWhatsAppConfig = async () => {
        try {
          const response = await fetch('/api/settings/blog');
          if (response.ok) {
            const data = await response.json();
            if (data.whatsappConfig?.enabled && data.whatsappConfig?.number) {
              console.log('Configurações do WhatsApp carregadas via API:', data.whatsappConfig);
              setFetchedConfig(data.whatsappConfig);
            }
          }
        } catch (error) {
          console.error('Erro ao buscar configurações do WhatsApp:', error);
        }
      };
      
      fetchWhatsAppConfig();
    }
  }, [number, message, hoverText, enabled]);

  // Forçar visibilidade do botão após montagem
  useEffect(() => {
    if (isMounted) {
      const timer = setTimeout(() => {
        const whatsappButton = document.querySelector('.whatsapp-button-container');
        if (whatsappButton) {
          whatsappButton.classList.add('whatsapp-visible');
          console.log('Botão WhatsApp forçado a ficar visível');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isMounted]);

  // Se não estiver montado, não renderiza
  if (!isMounted) return null;
  
  // Usar configurações buscadas da API se disponíveis
  const finalNumber = fetchedConfig?.number || number;
  const finalMessage = fetchedConfig?.message || message || 'Olá! Vim pelo site e gostaria de algumas informações.';
  const finalHoverText = fetchedConfig?.hoverText || hoverText || 'Precisa de ajuda? Fale conosco!';
  const finalEnabled = fetchedConfig?.enabled !== undefined ? fetchedConfig.enabled : enabled;
  
  // Log para depuração
  console.log('Renderizando botão WhatsApp:', { finalNumber, finalEnabled });
  
  // Se estiver desabilitado ou sem número, não renderiza
  if (!finalEnabled || !finalNumber) {
    console.log('Botão WhatsApp não será exibido:', { finalEnabled, finalNumber });
    return null;
  }

  // Formatar a URL do WhatsApp corretamente
  // Verificar se o número já inclui o código do país
  const formattedNumber = finalNumber.startsWith('55') ? finalNumber : `55${finalNumber}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(finalMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 drop-shadow-2xl whatsapp-button-container">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contato via WhatsApp"
      >
        <motion.div
          className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Ícone do WhatsApp */}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 448 512" 
            fill="white" 
            className="w-8 h-8"
          >
            {/* Font Awesome WhatsApp icon */}
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md whitespace-nowrap"
            >
              <div className="relative">
                <div className="text-sm font-medium whitespace-nowrap">{finalHoverText || 'Fale conosco pelo WhatsApp'}</div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </a>
    </div>
  );
}
