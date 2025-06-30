'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface RedirectConfig {
  type: string;
  slug: string;
}

interface WhatsAppConfig {
  number: string;
  message: string;
  hoverText: string;
  enabled: boolean;
}

interface MainPageClientProps {
  redirectConfig?: RedirectConfig;
  forceWhatsAppButton?: boolean;
  whatsappConfig?: WhatsAppConfig;
}

// Este arquivo é um componente cliente que serve para garantir
// que o Next.js gere corretamente o manifesto de referência do cliente para o grupo de rotas (main)
// e também para renderizar o botão de WhatsApp diretamente na página inicial
export default function MainPageClient({ redirectConfig, forceWhatsAppButton, whatsappConfig }: MainPageClientProps = {}) {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(whatsappConfig ? { whatsappConfig } : null);
  const [isMounted, setIsMounted] = useState(false);
  const [redirected, setRedirected] = useState(false);
  
  // Efeito para lidar com o redirecionamento após a montagem do componente
  useEffect(() => {
    if (redirectConfig && !redirected && isMounted) {
      console.log('Preparando redirecionamento para:', redirectConfig);
      console.log('Forçando visibilidade do botão de WhatsApp antes do redirecionamento');
      
      // Forçar a visibilidade do botão de WhatsApp antes do redirecionamento
      const forceWhatsAppButtonVisibility = () => {
        // Forçar visibilidade do botão fixo
        const fixedButton = document.getElementById('whatsapp-fixed-button');
        if (fixedButton) {
          fixedButton.style.visibility = 'visible';
          fixedButton.style.opacity = '1';
          fixedButton.style.zIndex = '99999';
          fixedButton.style.display = 'block';
          fixedButton.style.position = 'fixed';
          console.log('Botão WhatsApp fixo forçado a ficar visível');
        }
        
        // Forçar visibilidade de qualquer outro botão WhatsApp
        const buttons = document.querySelectorAll('.whatsapp-button-container');
        buttons.forEach(button => {
          button.classList.add('whatsapp-visible');
          (button as HTMLElement).style.visibility = 'visible';
          (button as HTMLElement).style.opacity = '1';
          (button as HTMLElement).style.zIndex = '9999';
        });
        console.log(`Forçando visibilidade de ${buttons.length} botões WhatsApp adicionais`);
        
        // Forçar visibilidade do container
        const container = document.getElementById('whatsapp-button-container');
        if (container) {
          container.style.visibility = 'visible';
          container.style.opacity = '1';
          container.style.zIndex = '99999';
          container.style.display = 'block';
          console.log('Container do botão WhatsApp forçado a ficar visível');
        }
      };
      
      // Executar várias vezes para garantir que o botão seja exibido
      forceWhatsAppButtonVisibility();
      setTimeout(forceWhatsAppButtonVisibility, 100);
      setTimeout(forceWhatsAppButtonVisibility, 300);
      setTimeout(forceWhatsAppButtonVisibility, 500);
      setTimeout(forceWhatsAppButtonVisibility, 800);
      
      // Atraso maior para garantir que o botão seja renderizado antes do redirecionamento
      const timer = setTimeout(() => {
        // Forçar visibilidade uma última vez antes de redirecionar
        forceWhatsAppButtonVisibility();
        
        setRedirected(true);
        console.log('Redirecionando agora para:', redirectConfig);
        
        // Redirecionar com base no tipo configurado
        if (redirectConfig.type === 'page') {
          router.push(`/${redirectConfig.slug}`);
        } else if (redirectConfig.type === 'category') {
          router.push(`/categorias/${redirectConfig.slug}`);
        } else if (redirectConfig.type === 'post') {
          router.push(`/blog/${redirectConfig.slug}`);
        }
      }, 2000); // Atraso maior (2 segundos) para garantir que o botão seja renderizado
      
      return () => clearTimeout(timer);
    }
  }, [redirectConfig, isMounted, redirected, router]);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Se já temos configurações do WhatsApp via props, não precisamos buscar
    if (!whatsappConfig) {
      // Buscar configurações do blog para obter dados do WhatsApp
      const fetchSettings = async () => {
        try {
          const response = await fetch('/api/settings/blog');
          if (response.ok) {
            const data = await response.json();
            setSettings(data);
            console.log('Configurações do WhatsApp carregadas via API:', data.whatsappConfig);
          }
        } catch (error) {
          console.error('Erro ao buscar configurações do blog:', error);
        }
      };
      
      fetchSettings();
    } else {
      console.log('Usando configurações do WhatsApp fornecidas via props:', whatsappConfig);
    }
  }, [whatsappConfig]);
  
  // Força a visibilidade do botão de WhatsApp na página inicial
  useEffect(() => {
    const forceUpdate = () => {
      // Seleciona todos os botões de WhatsApp na página
      const whatsappButtons = document.querySelectorAll('.whatsapp-button-container');
      if (whatsappButtons.length > 0) {
        whatsappButtons.forEach(button => {
          button.classList.add('whatsapp-visible');
          // Adiciona estilos inline para garantir visibilidade
          (button as HTMLElement).style.visibility = 'visible';
          (button as HTMLElement).style.opacity = '1';
          (button as HTMLElement).style.zIndex = '9999';
        });
        console.log(`${whatsappButtons.length} botões WhatsApp forçados a ficar visíveis`);
      } else {
        console.log('Botão WhatsApp não encontrado no DOM');
      }
    };
    
    // Executa após a montagem do componente
    if (isMounted) {
      // Executa imediatamente
      forceUpdate();
      
      // Executa várias vezes com intervalos crescentes para garantir que o botão seja exibido
      const timers = [
        setTimeout(forceUpdate, 100),
        setTimeout(forceUpdate, 500),
        setTimeout(forceUpdate, 1000),
        setTimeout(forceUpdate, 2000)
      ];
      
      return () => timers.forEach(timer => clearTimeout(timer));
    }
  }, [isMounted, settings, forceWhatsAppButton]);
  
  // Se não estiver montado, não renderiza nada visível, mas mantém um elemento para inicializar o WhatsApp
  if (!isMounted) {
    return <div id="whatsapp-initializer" className="hidden"></div>;
  }
  
  // Se temos forceWhatsAppButton e whatsappConfig, usamos esses valores
  // Caso contrário, verificamos se temos configurações do servidor
  let number, message, hoverText, enabled;
  
  if (forceWhatsAppButton && whatsappConfig) {
    // Usar configurações fornecidas via props
    number = whatsappConfig.number;
    message = whatsappConfig.message;
    hoverText = whatsappConfig.hoverText;
    enabled = true; // Forçar habilitado
    console.log('Usando configurações forçadas para o botão WhatsApp');
  } else if (settings?.whatsappConfig) {
    // Usar configurações do servidor
    number = settings.whatsappConfig.number;
    message = settings.whatsappConfig.message;
    hoverText = settings.whatsappConfig.hoverText;
    enabled = settings.whatsappConfig.enabled;
    console.log('Usando configurações do servidor para o botão WhatsApp');
  } else {
    // Sem configurações, usar valores padrão se forceWhatsAppButton estiver ativado
    if (forceWhatsAppButton) {
      number = '5511999999999';
      message = 'Olá! Vim pelo site e gostaria de algumas informações.';
      hoverText = 'Precisa de ajuda? Fale conosco!';
      enabled = true;
      console.log('Usando configurações padrão forçadas para o botão WhatsApp');
    } else {
      // Se não tiver configurações e não estiver forçando, renderiza apenas um placeholder invisível
      return <div id="whatsapp-waiting" className="hidden"></div>;
    }
  }
  
  // Se estiver desabilitado ou sem número, não renderiza (a menos que esteja forçando)
  if (!forceWhatsAppButton && (!enabled || !number)) return null;
  
  // Formatar a URL do WhatsApp corretamente
  const formattedNumber = number.startsWith('55') ? number : `55${number}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(message || '')}`;  
  
  return (
    <motion.div 
      className="fixed bottom-6 right-6 z-50 drop-shadow-2xl whatsapp-button-container whatsapp-visible"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#25D366] hover:bg-[#20BA5C] text-white p-4 rounded-full transition-all duration-300 relative group"
        onMouseEnter={() => {}}
        onMouseLeave={() => {}}
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
        <motion.div 
          className="absolute bottom-full right-0 mb-2 w-max bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
        >
          <div className="text-sm font-medium whitespace-nowrap">{hoverText || 'Fale conosco pelo WhatsApp'}</div>
          <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
        </motion.div>
      </a>
    </motion.div>
  );
}
