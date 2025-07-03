import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';

interface MenuItem {
  name: string;
  url: string;
  order: number;
}

interface Menu {
  name: string;
  location: string;
  items: MenuItem[];
}

interface Address {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

interface SocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

interface FooterProps {
  blogSettings?: {
    name: string;
    description: string;
    logo: string;
    menus?: Menu[];
    contactEmail?: string;
    contactPhone?: string;
    contactWhatsapp?: string;
    address?: Address;
    socialMedia?: SocialMedia;
  };
}

export default function Footer({ blogSettings }: FooterProps) {
  if (!blogSettings) return null;
  
  const currentYear = new Date().getFullYear();
  
  // Encontrar o menu do rodapé
  const footerMenu = blogSettings?.menus?.find(menu => menu.location === 'footer');
  // Ordenar os itens do menu por ordem
  const menuItems = footerMenu?.items?.sort((a, b) => a.order - b.order) || [];

  // Verificar se há informações de contato para exibir
  const hasContactInfo = blogSettings?.contactEmail || blogSettings?.contactPhone;
  const hasAddress = blogSettings?.address && (blogSettings?.address?.city || blogSettings?.address?.street);
  const hasSocialMedia = blogSettings?.socialMedia && (
    blogSettings?.socialMedia?.facebook || 
    blogSettings?.socialMedia?.twitter || 
    blogSettings?.socialMedia?.instagram || 
    blogSettings?.socialMedia?.linkedin || 
    blogSettings?.socialMedia?.youtube
  );

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
            
            {/* Redes Sociais */}
            {hasSocialMedia && (
              <div className="flex space-x-4">
                {blogSettings?.socialMedia?.facebook && (
                  <a
                    href={blogSettings.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                    <span className="sr-only">Facebook</span>
                  </a>
                )}
                
                {blogSettings?.socialMedia?.twitter && (
                  <a
                    href={blogSettings.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                )}
                
                {blogSettings?.socialMedia?.instagram && (
                  <a
                    href={blogSettings.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                )}
                
                {blogSettings?.socialMedia?.linkedin && (
                  <a
                    href={blogSettings.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                )}
                
                {blogSettings?.socialMedia?.youtube && (
                  <a
                    href={blogSettings.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                    <span className="sr-only">YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Menu do Rodapé */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    href={item.url} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              {/* Links padrão se não houver menu configurado */}
              {menuItems.length === 0 && (
                <>
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/sobre" className="text-gray-400 hover:text-white transition-colors">
                      Sobre
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/contato" className="text-gray-400 hover:text-white transition-colors">
                      Contato
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Contato */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              {blogSettings?.contactEmail && (
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <a href={`mailto:${blogSettings.contactEmail}`} className="text-gray-400 hover:text-white transition-colors">
                    {blogSettings.contactEmail}
                  </a>
                </li>
              )}
              
              {blogSettings?.contactPhone && (
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <a href={`tel:${blogSettings.contactPhone}`} className="text-gray-400 hover:text-white transition-colors">
                    {blogSettings.contactPhone}
                  </a>
                </li>
              )}
              
              {hasAddress && (
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <p className="text-gray-400">
                    {blogSettings.address?.street && blogSettings.address?.number && (
                      <>
                        {blogSettings.address.street}, {blogSettings.address.number}<br />
                      </>
                    )}
                    {blogSettings.address?.city && blogSettings.address?.state && (
                      <>
                        {blogSettings.address.city}, {blogSettings.address.state}<br />
                      </>
                    )}
                    {blogSettings.address?.country && (
                      <>{blogSettings.address.country}</>
                    )}
                    {blogSettings.address?.zipCode && (
                      <><br />CEP: {blogSettings.address.zipCode}</>
                    )}
                  </p>
                </li>
              )}
              
              {/* Exibir informações padrão se não houver dados configurados */}
              {!hasContactInfo && !hasAddress && (
                <>
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-400">contato@seublog.com</span>
                  </li>
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
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
