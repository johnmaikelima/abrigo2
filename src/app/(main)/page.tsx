import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Tag, User } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';
import BlogSettingsModel from '@/models/blog-settings';
import PageModel from '@/models/page';
import { redirect } from 'next/navigation';
// Importar o componente cliente para garantir que o manifesto seja gerado corretamente
import MainPageClient from './page.client';
// Importar função para serializar dados
import { serializeData } from '@/lib/utils/serialize';
// Importar o componente de botão WhatsApp fixo
import GlobalWhatsAppButton from '@/components/global-whatsapp-button';

// Configurações para forçar renderização dinâmica e resolver problemas de build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Desabilitar cache para garantir que sempre tenhamos os dados mais recentes
export const revalidate = 0; // Isso força o Next.js a revalidar a página a cada requisição

// Gerar metadata dinamicamente com base nas configurações do blog e da página inicial configurada
export async function generateMetadata() {
  await connectToDatabase();
  
  try {
    // Buscar configurações do blog
    const blogSettings = await getBlogSettings();
    
    // Buscar configurações da página inicial
    const homePageConfig = await getHomePageConfig();
    
    // Definir o título com base na configuração da página inicial
    let pageTitle = blogSettings.name;
    
    // Se a página inicial for personalizada, usar o título da página/categoria/post configurado
    if (homePageConfig.type !== 'default' && homePageConfig.title) {
      pageTitle = homePageConfig.title;
    }
    
    // Definir o título diretamente no head do HTML para garantir que seja exibido corretamente
    // Usar formato absoluto para evitar que Next.js adicione o URL ao título
    return {
      title: {
        absolute: pageTitle,
      },
      description: blogSettings.description,
    };
  } catch (error) {
    console.error('Erro ao gerar metadata:', error);
    // Em caso de erro, usar um título padrão
    return {
      title: {
        absolute: 'ALTUS',
      },
      description: 'Manutenção de Notebook com a Altustec',
    };
  }
}

// Definindo a interface Post para uso na página
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author?: {
    name: string;
    email: string;
  };
  tags: string[];
  category: string;
  coverImage?: string;
}

// Definindo a interface Category para uso na página
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

// Função para obter categorias em destaque
async function getFeaturedCategories(): Promise<Category[]> {
  await connectToDatabase();
  
  // Buscar categorias (no futuro, poderia haver um campo 'featured' para filtrar)
  const categories = await CategoryModel.find({})
    .limit(4)
    .lean();
  
  // Serializar os dados para evitar avisos de objetos MongoDB
  const serializedCategories = serializeData(categories);
  
  // Formatar as categorias para o formato esperado pelo frontend
  return serializedCategories.map((category: any) => ({
    id: category._id.toString ? category._id.toString() : category._id,
    name: category.name,
    slug: category.slug,
    description: category.description || ''
  }));
}

// Função para obter posts recentes
async function getRecentPosts(): Promise<Post[]> {
  await connectToDatabase();
  
  // Buscar posts publicados, ordenados por data de publicação (mais recentes primeiro)
  const posts = await PostModel.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(3)
    .populate('category', 'name slug')
    .lean();
  
  // Serializar os dados para evitar avisos de objetos MongoDB
  const serializedPosts = serializeData(posts);
  
  // Formatar os posts para o formato esperado pelo frontend
  return serializedPosts.map((post: any) => ({
    id: post._id.toString ? post._id.toString() : post._id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    published: post.published,
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: new Date(post.updatedAt).toISOString(),
    author: post.author ? {
      name: 'Autor do Sistema',
      email: 'sistema@example.com'
    } : {
      name: 'Usuário do Sistema',
      email: 'sistema@example.com'
    },
    tags: post.tags || [],
    category: post.category ? post.category.name : 'Sem categoria',
    coverImage: post.coverImage || ''
  }));
}

// Função para verificar a configuração da página inicial
async function getHomePageConfig() {
  await connectToDatabase();
  
  try {
    const settings = await BlogSettingsModel.findOne().lean();
    
    if (!settings || !settings.homePage || settings.homePage.type === 'default') {
      return { type: 'default' };
    }
    
    // Serializar os dados para evitar avisos de objetos MongoDB
    return serializeData(settings.homePage);
  } catch (error) {
    console.error('Erro ao buscar configurações da página inicial:', error);
    return { type: 'default' };
  }
}

// Função para buscar configurações do blog
async function getBlogSettings() {
  await connectToDatabase();
  
  try {
    // Buscar configurações do blog
    let settings = await BlogSettingsModel.findOne().lean();
    
    // Se não encontrar configurações, criar um documento vazio para garantir que exista
    if (!settings) {
      const BlogSettingsModelWithStatics = BlogSettingsModel as any;
      if (typeof BlogSettingsModelWithStatics.findOneOrCreate === 'function') {
        settings = await BlogSettingsModelWithStatics.findOneOrCreate();
      } else {
        // Criar um documento vazio se não existir o método findOneOrCreate
        settings = await BlogSettingsModel.create({});
        return {
          name: 'ALTUS',
          description: 'Manutenção de Notebook com a Altustec',
          whatsappConfig: {
            number: '5511999999999',
            message: 'Olá! Vim pelo site e gostaria de algumas informações.',
            hoverText: 'Precisa de ajuda? Fale conosco!',
            enabled: true
          }
        };
      }
    }
    
    // Garantir que as configurações do WhatsApp estejam presentes
    const whatsappConfig = settings.whatsappConfig || {
      number: '5511999999999',
      message: 'Olá! Vim pelo site e gostaria de algumas informações.',
      hoverText: 'Precisa de ajuda? Fale conosco!',
      enabled: true
    };
    
    // Serializar os dados para evitar avisos de objetos MongoDB
    return serializeData({
      ...settings,
      whatsappConfig
    });
  } catch (error) {
    console.error('Erro ao buscar configurações do blog:', error);
    // Em caso de erro, usar valores padrão
    return {
      name: 'ALTUS',
      description: 'Manutenção de Notebook com a Altustec',
      whatsappConfig: {
        number: '5511999999999',
        message: 'Olá! Vim pelo site e gostaria de algumas informações.',
        hoverText: 'Precisa de ajuda? Fale conosco!',
        enabled: true
      }
    };
  }
}

export default async function Home() {
  // Buscar configuração da página inicial
  const homePageConfig = await getHomePageConfig();
  
  // Buscar configurações do blog para o botão de WhatsApp
  const blogSettings = await getBlogSettings();
  
  // Se a configuração da página inicial não for 'default', vamos renderizar um componente
  // cliente que vai lidar com o redirecionamento, mas primeiro garantir que o botão de WhatsApp seja exibido
  if (homePageConfig.type !== 'default' && homePageConfig.slug) {
    return (
      <div className="w-full">
        {/* Adiciona o botão global de WhatsApp que será sempre exibido, antes de qualquer outro componente */}
        <GlobalWhatsAppButton 
          config={{
            number: blogSettings.whatsappConfig?.number || '5511999999999',
            message: blogSettings.whatsappConfig?.message || 'Olá! Vim pelo site e gostaria de algumas informações.',
            hoverText: blogSettings.whatsappConfig?.hoverText || 'Precisa de ajuda? Fale conosco!',
            enabled: true
          }}
        />
        
        {/* Adiciona um div com estilo inline para garantir que o botão seja visível */}
        <div 
          id="whatsapp-button-container" 
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 99999,
            visibility: 'visible',
            opacity: 1,
            display: 'block'
          }}
        />
        
        <MainPageClient 
          forceWhatsAppButton={true}
          whatsappConfig={{
            number: blogSettings.whatsappConfig?.number || '5511999999999',
            message: blogSettings.whatsappConfig?.message || 'Olá! Vim pelo site e gostaria de algumas informações.',
            hoverText: blogSettings.whatsappConfig?.hoverText || 'Precisa de ajuda? Fale conosco!',
            enabled: true // Força habilitado
          }}
          redirectConfig={homePageConfig}
        />
      </div>
    );
  }
  
  // Se não houver configuração específica ou for 'default', renderizar a página inicial padrão
  // Buscar posts recentes e categorias em destaque
  const [recentPosts, featuredCategories] = await Promise.all([
    getRecentPosts(),
    getFeaturedCategories()
  ]);

  return (
    <div className="w-full">
      {/* Componente cliente para garantir que o manifesto seja gerado corretamente e o botão de WhatsApp seja exibido */}
      <MainPageClient />
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ideias que inspiram, <span className="text-blue-600">histórias que transformam</span>
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Um blog moderno construído com Next.js, MongoDB e Tailwind CSS.
              Compartilhe suas ideias com o mundo e conecte-se com leitores apaixonados.  
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/blog" 
                className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center"
              >
                Explorar Artigos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="/dashboard" 
                className="px-6 py-3 rounded-md font-medium bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <Image 
              src="/post-placeholder-1.jpg" 
              alt="Blog Hero" 
              width={600} 
              height={400}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Posts Recentes</h2>
            <Link 
              href="/blog" 
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              Ver todos
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                {post.coverImage && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    <Link 
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <span className="text-sm text-gray-600">{post.author?.name || 'Admin'}</span>
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Ler mais
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Categorias em Destaque</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredCategories.length > 0 ? (
              featuredCategories.map((category) => (
                <Link 
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-blue-100">Explorar artigos</p>
                </Link>
              ))
            ) : (
              // Fallback para quando não há categorias
              <div className="col-span-full text-center py-8">
                <p>Nenhuma categoria encontrada. <Link href="/dashboard/categories" className="text-blue-600 hover:underline">Adicione algumas categorias</Link>.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Comece a escrever hoje</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-blue-100">
            Compartilhe suas ideias, histórias e conhecimentos com o mundo.
            Junte-se à nossa comunidade de escritores e leitores apaixonados.
          </p>
          <Link 
            href="/dashboard/posts/new" 
            className="px-8 py-4 rounded-md font-medium bg-white text-blue-700 hover:bg-blue-50 transition-colors inline-flex items-center"
          >
            Criar Novo Post
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-50 rounded-xl p-8 md:p-12 shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Assine nossa Newsletter</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Receba os melhores artigos diretamente na sua caixa de entrada.
                Sem spam, prometemos!  
              </p>
            </div>
            {/* Formulário de newsletter será implementado com um componente client */}
            <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="flex-grow px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Renderiza o componente cliente com configurações de WhatsApp para garantir que o botão seja exibido */}
      <MainPageClient 
        forceWhatsAppButton={true}
        whatsappConfig={{
          number: blogSettings.whatsappConfig?.number || '5511999999999',
          message: blogSettings.whatsappConfig?.message || 'Olá! Vim pelo site e gostaria de algumas informações.',
          hoverText: blogSettings.whatsappConfig?.hoverText || 'Precisa de ajuda? Fale conosco!',
          enabled: true
        }}
        redirectConfig={homePageConfig.type !== 'default' ? homePageConfig : undefined}
      />
      
      {/* O botão de WhatsApp global já é renderizado pelo layout principal */}
    </div>
  );
}
