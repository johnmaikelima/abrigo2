'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Mail, Phone, MapPin, Clock, ExternalLink } from 'lucide-react';

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

interface FooterLink {
  label: string | React.ReactNode;
  url: string;
  isExternal: boolean;
}

interface FooterColumn {
  title: string;
  links: Array<FooterLink | null>;
}

interface BlogSettings {
  name: string;
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  address: BlogAddress;
  socialMedia: BlogSocialMedia;
  menus: MenuItem[];
  whatsappConfig?: {
    number: string;
    message: string;
    hoverText: string;
    enabled: boolean;
  };
  contactForm?: {
    enabled: boolean;
    recipientEmail: string;
    captchaEnabled: boolean;
    successMessage: string;
    errorMessage: string;
  };
}

type FooterProps = {
  themeSettings?: {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    footer: {
      showCopyright: boolean;
      copyrightText: string;
      showSocialLinks: boolean;
      socialLinks: Array<{
        platform: string;
        url: string;
        icon: string;
      }>;
      columns: Array<{
        title: string;
        links: Array<{
          label: string;
          url: string;
          isExternal: boolean;
        }>;
      }>;
    };
  };
};

export default function SiteFooter({ themeSettings }: FooterProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<FooterProps['themeSettings']>();

  // Estado para armazenar as configurações do blog
  const [blogSettings, setBlogSettings] = useState<BlogSettings | null>(null);

  // Carregar configurações do tema e do blog
  useEffect(() => {
    const fetchThemeSettings = async () => {
      try {
        const response = await fetch('/api/theme-settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do tema:', error);
      }
    };

    const fetchBlogSettings = async () => {
      try {
        const response = await fetch('/api/settings/blog');
        if (response.ok) {
          const data = await response.json();
          setBlogSettings(data);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações do blog:', error);
      }
    };

    fetchThemeSettings();
    fetchBlogSettings();
    setMounted(true);
  }, []);

  // Use as configurações fornecidas ou as configurações padrão
  const footerSettings = settings?.footer || themeSettings?.footer || {
    showCopyright: true,
    copyrightText: `© ${new Date().getFullYear()} ${blogSettings?.name || 'Blog'}. Todos os direitos reservados.`,
    showSocialLinks: true,
    socialLinks: [
      { platform: 'Twitter', url: blogSettings?.socialMedia?.twitter || 'https://twitter.com', icon: 'twitter' },
      { platform: 'Facebook', url: blogSettings?.socialMedia?.facebook || 'https://facebook.com', icon: 'facebook' },
      { platform: 'Instagram', url: blogSettings?.socialMedia?.instagram || 'https://instagram.com', icon: 'instagram' },
      { platform: 'LinkedIn', url: blogSettings?.socialMedia?.linkedin || 'https://linkedin.com', icon: 'linkedin' },
      { platform: 'YouTube', url: blogSettings?.socialMedia?.youtube || 'https://youtube.com', icon: 'youtube' },
    ].filter((link: {platform: string, url: string, icon: string}) => link.url && link.url !== ''),
    columns: [
      // Menu dinâmico configurado pelo administrador
      blogSettings?.menus && blogSettings.menus.length > 0 ? {
        title: 'Menu',
        links: blogSettings.menus
          .sort((a: MenuItem, b: MenuItem) => a.order - b.order)
          .map((item: MenuItem) => ({
            label: item.name,
            url: item.url,
            isExternal: item.url.startsWith('http') || item.url.startsWith('mailto:') || item.url.startsWith('tel:'),
          })),
      } : null,
      
      // Links rápidos
      {
        title: 'Links Rápidos',
        links: [
          { label: 'Home', url: '/', isExternal: false },
          { label: 'Blog', url: '/blog', isExternal: false },
          { label: 'Contato', url: '/contato', isExternal: false },
          { label: 'Política de Privacidade', url: '/politica-de-privacidade', isExternal: false },
          { label: 'Termos de Uso', url: '/termos-de-uso', isExternal: false },
        ],
      },
      // Menu padrão de links úteis
      {
        title: 'Links Úteis',
        links: [
          { label: 'Home', url: '/', isExternal: false },
          { label: 'Blog', url: '/blog', isExternal: false },
          { label: 'Sobre', url: '/sobre', isExternal: false },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Política de Privacidade', url: '/politica-de-privacidade', isExternal: false },
        ],
      },
      blogSettings?.contactEmail || blogSettings?.contactPhone || (blogSettings?.address && Object.values(blogSettings.address).some(Boolean)) ? {
        title: 'Contato',
        links: [
          blogSettings.contactEmail ? 
            { 
              label: (
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>{blogSettings.contactEmail}</span>
                </div>
              ), 
              url: `mailto:${blogSettings.contactEmail}`, 
              isExternal: true 
            } : null,
          blogSettings.contactPhone ? 
            { 
              label: (
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{blogSettings.contactPhone}</span>
                </div>
              ), 
              url: `tel:${blogSettings.contactPhone.replace(/\D/g, '')}`, 
              isExternal: true 
            } : null,
          blogSettings.contactWhatsapp ? 
            { 
              label: (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>WhatsApp</span>
                </div>
              ), 
              url: `https://wa.me/${blogSettings.contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(blogSettings.whatsappConfig?.message || 'Olá! Vim pelo site e gostaria de algumas informações.')}`, 
              isExternal: true 
            } : null,
          // Endereço completo
          blogSettings.address && (blogSettings.address.street || blogSettings.address.city) ? 
            { 
              label: (
                <div className="flex items-start gap-2 mt-2">
                  <MapPin size={16} className="mt-1" />
                  <div>
                    {blogSettings.address.street && blogSettings.address.number && (
                      <div>{blogSettings.address.street}, {blogSettings.address.number}</div>
                    )}
                    {blogSettings.address.city && blogSettings.address.state && (
                      <div>{blogSettings.address.city} - {blogSettings.address.state}</div>
                    )}
                    {blogSettings.address.zipCode && (
                      <div>CEP: {blogSettings.address.zipCode}</div>
                    )}
                    {blogSettings.address.country && (
                      <div>{blogSettings.address.country}</div>
                    )}
                  </div>
                </div>
              ), 
              url: 'https://maps.google.com/?q=' + encodeURIComponent(
                [blogSettings.address.street, blogSettings.address.number, 
                 blogSettings.address.city, blogSettings.address.state, 
                 blogSettings.address.country].filter(Boolean).join(', ')
              ), 
              isExternal: true 
            } : null,
          // Link para página de contato
          { 
            label: (
              <div className="flex items-center gap-2 mt-3 text-primary font-medium">
                <ExternalLink size={16} />
                <span>Página de Contato</span>
              </div>
            ), 
            url: '/contato', 
            isExternal: false 
          },
        ].filter(Boolean),
      } : null,
    ].filter(column => column && column.links && column.links.length > 0),
  };

  const colors = settings?.colors || themeSettings?.colors || {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827',
  };

  // Evitar problemas de hidratação
  if (!mounted) {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: colors.background + '05',
        color: colors.text,
        borderTop: `1px solid ${colors.text}10`,
        padding: '2rem 0',
      }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '1rem' }}>
              Blog
            </h3>
            <p style={{ color: colors.text, marginBottom: '1rem' }}>
              Um blog simples e elegante para compartilhar suas ideias com o mundo.
            </p>
            {footerSettings.showSocialLinks && (
              <div className="flex gap-4">
                {footerSettings.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: colors.primary,
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      border: `1px solid ${colors.primary}`,
                    }}
                  >
                    {link.platform.charAt(0)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {footerSettings.columns.map((column, index) => (
            column && (
              <div key={index}>
                <h3 style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '1rem' }}>
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.filter((link: any) => link !== null).map((link: any, linkIndex: number) => (
                    link && (
                      <li key={linkIndex}>
                        {link.isExternal ? (
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: colors.text }}
                            className="hover:underline"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            href={link.url}
                            style={{ color: colors.text }}
                            className="hover:underline"
                          >
                            {link.label}
                          </Link>
                        )}
                      </li>
                    )
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>

        {footerSettings.showCopyright && (
          <div
            style={{
              borderTop: `1px solid ${colors.text}10`,
              marginTop: '2rem',
              paddingTop: '1rem',
              textAlign: 'center',
              color: colors.text + '80',
            }}
          >
            {footerSettings.copyrightText}
          </div>
        )}
      </div>
    </footer>
  );
}
