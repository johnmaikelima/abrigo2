import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import { Metadata } from 'next';
import BlogSettingsModel from '@/models/blog-settings';
import './styles.css';

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

// Função para buscar post pelo slug
async function getPostBySlug(slug: string): Promise<Post | null> {
  await connectToDatabase();
  
  const post = await PostModel.findOne({ slug, published: true })
    .populate('category', 'name slug')
    .lean() as any;
  
  if (!post) return null;
  
  return {
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
    coverImage: post.coverImage || undefined
  };
}

// Função para gerar metadados dinâmicos para a página
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  
  // Buscar configurações do blog
  await connectToDatabase();
  const settingsDoc = await BlogSettingsModel.findOne().lean();
  
  // Definir valores padrão ou usar os valores do banco de dados
  const settings = {
    name: settingsDoc?.name || 'Blog Moderno',
    description: settingsDoc?.description || 'Um blog sobre tecnologia e desenvolvimento web'
  };
  
  // Buscar post pelo slug
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: `Post não encontrado | ${settings.name}`,
      description: settings.description,
    };
  }
  
  // Criar uma descrição baseada no excerpt do post ou truncar o conteúdo
  const description = post.excerpt || 
    (post.content.length > 160 ? `${post.content.substring(0, 157)}...` : post.content);
  
  return {
    title: `${post.title} | ${settings.name}`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name || 'Autor'],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-900 px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
        <p className="mb-6">O post que você está procurando não existe ou foi removido.</p>
        <Link 
          href="/blog" 
          className="flex items-center gap-2 text-blue-600 font-medium"
        >
          <ArrowLeft size={16} />
          Voltar para o blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-gray-600 mb-6 font-medium"
        >
          <ArrowLeft size={16} />
          Voltar para o blog
        </Link>

        <article>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {post.coverImage && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img 
                src={post.coverImage} 
                alt={post.title}
                className="w-full h-auto object-cover rounded-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}

          <div className="flex items-center gap-2 mb-6 text-gray-500 text-sm">
            <time dateTime={post.createdAt}>
              {new Date(post.createdAt).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </time>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-sm leading-relaxed text-lg">
            {/* Renderizando o conteúdo HTML */}
            <div 
              className="blog-content" 
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
