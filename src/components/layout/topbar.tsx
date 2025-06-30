import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

// Interface para as configurações do blog
interface BlogSettings {
  name: string;
  description: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  address?: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  socialMedia?: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  menus?: any[];
}

interface TopbarProps {
  blogSettings?: BlogSettings;
}

// Componente do servidor para melhor SEO
export default function Topbar({ blogSettings }: TopbarProps) {
  if (!blogSettings) return null;
  
  // Verificar se há pelo menos uma informação de contato ou rede social para exibir
  const hasContactInfo = blogSettings?.contactEmail || blogSettings?.contactPhone;
  const hasAddress = blogSettings?.address && (blogSettings?.address?.city || blogSettings?.address?.street);
  const hasSocialMedia = blogSettings?.socialMedia && (
    blogSettings?.socialMedia?.facebook || 
    blogSettings?.socialMedia?.twitter || 
    blogSettings?.socialMedia?.instagram || 
    blogSettings?.socialMedia?.linkedin || 
    blogSettings?.socialMedia?.youtube
  );
  
  // Se não houver configurações ou informações para exibir, não renderizar o topbar
  if (!hasContactInfo && !hasAddress && !hasSocialMedia) {
    return null;
  }
  
  return (
    <div className="bg-gray-100 text-gray-700 py-2 border-b border-gray-200 fixed top-0 left-0 right-0 w-full z-50 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          {/* Informações de contato e endereço */}
          <div className="flex flex-wrap items-center mb-2 md:mb-0">
            {blogSettings.contactEmail && (
              <a 
                href={`mailto:${blogSettings.contactEmail}`} 
                className="flex items-center mr-6 hover:text-blue-600 transition-colors"
              >
                <Mail className="h-4 w-4 mr-1" />
                <span>{blogSettings.contactEmail}</span>
              </a>
            )}
            
            {blogSettings.contactPhone && (
              <a 
                href={`tel:${blogSettings.contactPhone}`} 
                className="flex items-center mr-6 hover:text-blue-600 transition-colors"
              >
                <Phone className="h-4 w-4 mr-1" />
                <span>{blogSettings.contactPhone}</span>
              </a>
            )}
            
            {hasAddress && (
              <div className="flex items-center hover:text-blue-600 transition-colors">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {blogSettings.address?.street && (
                    `${blogSettings.address.street}${blogSettings.address.number ? ', ' + blogSettings.address.number : ''} - ${blogSettings.address.city || ''}${blogSettings.address.state ? ', ' + blogSettings.address.state : ''}`
                  )}
                </span>
              </div>
            )}
          </div>
          
          {/* Redes sociais */}
          {hasSocialMedia && (
            <div className="flex items-center space-x-3">
              {blogSettings.socialMedia?.facebook && (
                <a 
                  href={blogSettings.socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              
              {blogSettings.socialMedia?.twitter && (
                <a 
                  href={blogSettings.socialMedia.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              
              {blogSettings.socialMedia?.instagram && (
                <a 
                  href={blogSettings.socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              
              {blogSettings.socialMedia?.linkedin && (
                <a 
                  href={blogSettings.socialMedia.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              
              {blogSettings.socialMedia?.youtube && (
                <a 
                  href={blogSettings.socialMedia.youtube} 
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
