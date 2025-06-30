import { useState, useEffect } from 'react';

type BlogSettings = {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  defaultAuthorName: string;
  defaultAuthorEmail: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  whatsappConfig: {
    number: string;
    message: string;
    hoverText: string;
    enabled: boolean;
  };
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
    from: string;
  };
  contactForm: {
    enabled: boolean;
    recipientEmail: string;
    captchaEnabled: boolean;
    successMessage: string;
    errorMessage: string;
  };
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  homePage: {
    type: string;
    id: string;
    slug: string;
    title: string;
  };
  menus: Array<{
    name: string;
    location: string;
    items: Array<{
      name: string;
      url: string;
      order: number;
      isCTA?: boolean;
    }>;
  }>;
};

export function useBlogSettings() {
  const [settings, setSettings] = useState<BlogSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings/blog');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar configurações do blog');
        }
        
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, isLoading, error };
}
