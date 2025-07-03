'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';

interface BlogAddress {
  street: string;
  number: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

interface BlogSocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

interface BlogSettings {
  name: string;
  description: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  address: BlogAddress;
  socialMedia: BlogSocialMedia;
}

interface TopbarClientProps {
  blogSettings?: BlogSettings;
}

export default function TopbarClient({ blogSettings }: TopbarClientProps) {
  const [fullBlogSettings, setFullBlogSettings] = useState<BlogSettings | null>(null);
  
  // Buscar configurações completas do blog
  useEffect(() => {
    const fetchBlogSettings = async () => {
      try {
        const response = await fetch('/api/settings/blog');
        if (response.ok) {
          const data = await response.json();
          
          // Verificar se os dados estão no formato esperado e extrair settings
          if (data.success && data.settings) {
            setFullBlogSettings(data.settings);
          } else {
            // Se os dados não estiverem no formato esperado, usar diretamente
            setFullBlogSettings(data);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do blog:', error);
      }
    };

    fetchBlogSettings();
  }, []);

  // Verificar se há pelo menos uma informação de contato ou rede social para exibir
  const hasContactInfo = fullBlogSettings?.contactEmail || fullBlogSettings?.contactPhone;
  const hasAddress = fullBlogSettings?.address && (fullBlogSettings?.address?.city || fullBlogSettings?.address?.street);
  const hasSocialMedia = fullBlogSettings?.socialMedia && (
    fullBlogSettings?.socialMedia?.facebook || 
    fullBlogSettings?.socialMedia?.twitter || 
    fullBlogSettings?.socialMedia?.instagram || 
    fullBlogSettings?.socialMedia?.linkedin || 
    fullBlogSettings?.socialMedia?.youtube
  );
  
  // Se não houver configurações ou informações para exibir, não renderizar o topbar
  if (!fullBlogSettings || (!hasContactInfo && !hasAddress && !hasSocialMedia)) {
    return null;
  }

  return (
    <div className="bg-gray-100 text-gray-700 py-2 border-b border-gray-200 fixed top-0 left-0 right-0 w-full z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Informações de contato e endereço */}
          <div className="flex flex-wrap items-center mb-2 md:mb-0">
            {fullBlogSettings.contactEmail && (
              <a 
                href={`mailto:${fullBlogSettings.contactEmail}`} 
                className="flex items-center mr-6 hover:text-blue-600 transition-colors"
              >
                <Mail className="h-4 w-4 mr-1" />
                <span>{fullBlogSettings.contactEmail}</span>
              </a>
            )}
            
            {fullBlogSettings.contactPhone && (
              <a 
                href={`tel:${fullBlogSettings.contactPhone}`} 
                className="flex items-center mr-6 hover:text-blue-600 transition-colors"
              >
                <Phone className="h-4 w-4 mr-1" />
                <span>{fullBlogSettings.contactPhone}</span>
              </a>
            )}
            
            {hasAddress && (
              <div className="flex items-center hover:text-blue-600 transition-colors">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {fullBlogSettings.address?.street && (
                    `${fullBlogSettings.address.street}${fullBlogSettings.address.number ? ', ' + fullBlogSettings.address.number : ''} - ${fullBlogSettings.address.city || ''}${fullBlogSettings.address.state ? ', ' + fullBlogSettings.address.state : ''}`
                  )}
                </span>
              </div>
            )}
          </div>
          
          {/* Redes sociais */}
          {hasSocialMedia && (
            <div className="flex items-center space-x-3">
              {fullBlogSettings.socialMedia?.facebook && (
                <a 
                  href={fullBlogSettings.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              
              {fullBlogSettings.socialMedia?.twitter && (
                <a 
                  href={fullBlogSettings.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              
              {fullBlogSettings.socialMedia?.instagram && (
                <a 
                  href={fullBlogSettings.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              
              {fullBlogSettings.socialMedia?.linkedin && (
                <a 
                  href={fullBlogSettings.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              
              {fullBlogSettings.socialMedia?.youtube && (
                <a 
                  href={fullBlogSettings.socialMedia.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
