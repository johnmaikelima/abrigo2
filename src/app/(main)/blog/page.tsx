import Link from 'next/link';
import Image from 'next/image';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';

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

// Função para obter configurações do tema (simulada)
async function getThemeSettings() {
  // Em um ambiente real, isso seria uma chamada à API ou banco de dados
  // const response = await fetch('/api/theme-settings');
  // const data = await response.json();
  
  // Usando dados simulados por enquanto
  return {
    colors: {
      primary: '#3b82f6', // Azul
      secondary: '#10b981', // Verde
      accent: '#8b5cf6', // Roxo
      background: '#ffffff',
      text: '#111827',
    },
    typography: {
      headingFont: '"Inter", sans-serif',
      bodyFont: '"Inter", sans-serif',
    },
    layout: {
      containerWidth: '1200px',
      borderRadius: '0.5rem',
    }
  };
}

// Função para buscar posts do MongoDB
async function fetchPosts(): Promise<Post[]> {
  await connectToDatabase();
  
  // Buscar apenas posts publicados
  const posts = await PostModel.find({ published: true })
    .sort({ createdAt: -1 })
    .populate('category', 'name slug')
    .lean();
  
  // Formatar os posts para o formato esperado pelo frontend
  return posts.map((post: any) => ({
    id: post._id.toString(),
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

export default async function Blog() {
  const themeSettings = await getThemeSettings();
  const posts = await fetchPosts();

  // Obter as cores do tema ou usar valores padrão
  const colors = themeSettings?.colors || {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#111827',
  };

  // Obter as configurações de tipografia ou usar valores padrão
  const typography = themeSettings?.typography || {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: 16,
  };

  return (
    <div className="container mx-auto py-12">
      <header className="mb-12 text-center">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ 
            color: colors.primary,
            fontFamily: typography.headingFont,
          }}
        >
          Blog
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          Artigos, tutoriais e insights sobre desenvolvimento web, design e tecnologia.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            style={{ 
              borderColor: `${colors.text}10`,
              backgroundColor: colors.background,
            }}
          >
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
              <div className="flex items-center gap-2 mb-3">
                <span 
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${colors.primary}20`,
                    color: colors.primary,
                  }}
                >
                  {post.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <h2 
                className="text-xl font-bold mb-3"
                style={{ 
                  fontFamily: typography.headingFont,
                }}
              >
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="hover:underline"
                  style={{ color: colors.text }}
                >
                  {post.title}
                </Link>
              </h2>
              
              <p 
                className="mb-4"
                style={{ 
                  color: `${colors.text}90`,
                  fontFamily: typography.bodyFont,
                }}
              >
                {post.excerpt}
              </p>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    {post.author?.name.charAt(0)}
                  </div>
                  <span className="text-sm">{post.author?.name}</span>
                </div>
                
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  Ler mais →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
