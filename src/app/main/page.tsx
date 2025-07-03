import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Tag, User } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';

// Definindo a interface Post para uso na página
interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  author?: {
    name: string;
    email: string;
  };
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
  
  // Formatar as categorias para o formato esperado pelo frontend
  return categories.map((category: any) => ({
    id: category._id.toString(),
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
  
  // Serializar e formatar os posts para o formato esperado pelo frontend
  return posts.map((post: any) => serializeMongoDBObject({
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    published: post.published,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: post.author ? {
      name: post.author.name || 'Autor do Sistema',
      email: post.author.email || 'sistema@example.com'
    } : {
      name: 'Usuário do Sistema',
      email: 'sistema@example.com'
    },
    category: post.category ? post.category.name : 'Sem categoria',
    coverImage: post.coverImage || ''
  }));
}

export default async function Home() {
  // Buscar posts recentes e categorias em destaque
  const [recentPosts, featuredCategories] = await Promise.all([
    getRecentPosts(),
    getFeaturedCategories()
  ]);

  return (
    <div className="container mx-auto px-4 bg-white w-full">
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
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/images/hero-image.jpg"
                alt="Blog Hero Image"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Artigos Recentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {post.coverImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
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
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p>Nenhum artigo publicado ainda. <Link href="/dashboard/posts/new" className="text-blue-600 hover:underline">Crie seu primeiro post</Link>.</p>
              </div>
            )}
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
    </div>
  );
}
