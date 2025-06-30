import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Topbar from '@/components/layout/topbar';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import BlogSettingsModel from '@/models/blog-settings';

// Definir interfaces para tipagem
interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

interface MenuItem {
  name: string;
  url: string;
  order: number;
  isCTA?: boolean;
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

interface BlogSettings {
  _id?: string;
  name: string;
  description: string;
  logo: string;
  menus?: Menu[];
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
  address?: Address;
  socialMedia?: SocialMedia;
}

// Função para buscar categorias do MongoDB
async function getCategories(): Promise<Category[]> {
  await connectToDatabase();
  
  try {
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    
    // Formatar as categorias para o frontend
    return categories.map((category: any) => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    }));
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

// Função para buscar configurações do blog
async function getBlogSettings(): Promise<BlogSettings> {
  await connectToDatabase();
  
  try {
    // Buscar configurações ou usar valores padrão
    const settings = await BlogSettingsModel.findOne().lean() as any;
    
    // Definir valores padrão caso não exista configuração
    const defaultSettings: BlogSettings = {
      name: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
      logo: '/logo.png',
      menus: []
    };
    
    if (!settings) {
      return defaultSettings;
    }
    
    // Converter _id para string se existir
    if (settings._id) {
      settings._id = settings._id.toString();
    }
    
    // Verificar se existem menus configurados
    const menus = settings.menus || [];
    
    // Converter os menus e seus itens para objetos JavaScript simples
    const serializedMenus = menus.map((menu: any) => ({
      _id: menu._id ? menu._id.toString() : undefined,
      name: menu.name,
      location: menu.location,
      items: (menu.items || []).map((item: any) => ({
        _id: item._id ? item._id.toString() : undefined,
        name: item.name,
        url: item.url,
        order: item.order,
        isCTA: item.isCTA
      }))
    }));
    
    // Serializar informações de contato e endereço
    const serializedAddress = settings.address ? {
      street: settings.address.street || '',
      number: settings.address.number || '',
      complement: settings.address.complement || '',
      neighborhood: settings.address.neighborhood || '',
      city: settings.address.city || '',
      state: settings.address.state || '',
      country: settings.address.country || '',
      zipCode: settings.address.zipCode || ''
    } : undefined;
    
    const serializedSocialMedia = settings.socialMedia ? {
      facebook: settings.socialMedia.facebook || '',
      twitter: settings.socialMedia.twitter || '',
      instagram: settings.socialMedia.instagram || '',
      linkedin: settings.socialMedia.linkedin || '',
      youtube: settings.socialMedia.youtube || ''
    } : undefined;
    
    // Retornar objeto serializado com todas as informações necessárias
    return {
      name: settings.name || defaultSettings.name,
      description: settings.description || defaultSettings.description,
      logo: settings.logo || defaultSettings.logo,
      menus: serializedMenus,
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      contactWhatsapp: settings.contactWhatsapp || '',
      address: serializedAddress,
      socialMedia: serializedSocialMedia
    };
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    return {
      name: 'Blog Moderno',
      description: 'Um blog sobre tecnologia e desenvolvimento web',
      logo: '/logo.png',
      menus: []
    };
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Buscar categorias e configurações do MongoDB
  const categories = await getCategories();
  const blogSettings = await getBlogSettings();
  
  return (
    <div className="flex flex-col min-h-screen bg-white w-full">
      <Topbar blogSettings={blogSettings} />
      <Header categories={categories} blogSettings={blogSettings} />
      <main className="flex-grow pt-32 w-full">
        <div className="w-full">
          {children}
        </div>
      </main>
      <Footer blogSettings={blogSettings} />
    </div>
  );
}
