'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

interface MenuItem {
  name: string;
  url: string;
  order: number;
}

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
  menus: MenuItem[];
}

interface Menu {
  name: string;
  location: string;
  items: MenuItem[];
}

interface FooterClientProps {
  blogSettings?: {
    name: string;
    description: string;
    logo: string;
    menus?: Menu[];
  };
}

export default function FooterClient({ blogSettings }: FooterClientProps) {
  const currentYear = new Date().getFullYear();
  const [fullBlogSettings, setFullBlogSettings] = useState<BlogSettings | null>(null);
  
  // Encontrar o menu do rodapé
  const footerMenu = blogSettings?.menus?.find(menu => menu.location === 'footer');
  // Ordenar os itens do menu por ordem
  const menuItems = footerMenu?.items?.sort((a, b) => a.order - b.order) || [];

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
            console.log('Configurações do rodapé carregadas:', data.settings);
          } else {
            // Se os dados não estiverem no formato esperado, usar diretamente
            setFullBlogSettings(data);
            console.log('Configurações do rodapé carregadas (formato antigo):', data);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do blog:', error);
      }
    };

    fetchBlogSettings();
  }, []);

  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src={blogSettings?.logo || "/logo-white.png"}
                alt={`${blogSettings?.name || "Blog"} Logo`}
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              {blogSettings?.description || "Um blog moderno sobre tecnologia, desenvolvimento web e as últimas tendências do mundo digital. Compartilhamos conhecimento e experiências para ajudar você a se manter atualizado."}
            </p>
            <div className="flex space-x-4">
              {fullBlogSettings?.socialMedia?.facebook && (
                <a
                  href={fullBlogSettings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              )}
              {fullBlogSettings?.socialMedia?.twitter && (
                <a
                  href={fullBlogSettings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              )}
              {fullBlogSettings?.socialMedia?.instagram && (
                <a
                  href={fullBlogSettings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              )}
              {fullBlogSettings?.socialMedia?.linkedin && (
                <a
                  href={fullBlogSettings.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              
              {/* Exibir ícones padrão se não houver redes sociais configuradas */}
              {!fullBlogSettings?.socialMedia?.facebook && 
               !fullBlogSettings?.socialMedia?.twitter && 
               !fullBlogSettings?.socialMedia?.instagram && 
               !fullBlogSettings?.socialMedia?.linkedin && (
                <>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              {footerMenu?.name || "Links Rápidos"}
            </h3>
            <ul className="space-y-2">
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.url}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Links padrão caso não haja menu configurado
                <>
                  <li>
                    <Link
                      href="/"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/sobre"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Sobre Nós
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categorias"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Categorias
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contato"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Contato
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/politica-de-privacidade"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Política de Privacidade
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">
              Contato
            </h3>
            <ul className="space-y-3">
              {fullBlogSettings?.contactEmail && (
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <a href={`mailto:${fullBlogSettings.contactEmail}`} className="text-gray-400 hover:text-white transition-colors">
                    {fullBlogSettings.contactEmail}
                  </a>
                </li>
              )}
              
              {fullBlogSettings?.contactPhone && (
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <a href={`tel:${fullBlogSettings.contactPhone}`} className="text-gray-400 hover:text-white transition-colors">
                    {fullBlogSettings.contactPhone}
                  </a>
                </li>
              )}
              
              {fullBlogSettings?.address && (
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p className="text-gray-400">
                    {fullBlogSettings.address.street && fullBlogSettings.address.number && (
                      <>
                        {fullBlogSettings.address.street}, {fullBlogSettings.address.number}<br />
                      </>
                    )}
                    {fullBlogSettings.address.city && fullBlogSettings.address.state && (
                      <>
                        {fullBlogSettings.address.city}, {fullBlogSettings.address.state}<br />
                      </>
                    )}
                    {fullBlogSettings.address.country && (
                      <>{fullBlogSettings.address.country}</>
                    )}
                    {fullBlogSettings.address.zipCode && (
                      <><br />CEP: {fullBlogSettings.address.zipCode}</>
                    )}
                  </p>
                </li>
              )}
              
              {/* Exibir informações padrão se não houver dados configurados */}
              {!fullBlogSettings?.contactEmail && !fullBlogSettings?.contactPhone && !fullBlogSettings?.address?.street && (
                <>
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-400">contato@seublog.com</span>
                  </li>
                  <li>
                    <p className="text-gray-400">
                      Av. Tecnologia, 1000<br />
                      São Paulo, SP<br />
                      Brasil
                    </p>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="max-w-md mx-auto md:mx-0">
            <h3 className="text-lg font-semibold mb-4">Assine nossa Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Receba as últimas atualizações e artigos diretamente na sua caixa de entrada.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-grow px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors"
              >
                Assinar
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-gray-800 pt-6 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} {blogSettings?.name || "Seu Blog"}. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
