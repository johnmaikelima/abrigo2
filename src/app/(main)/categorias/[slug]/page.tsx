import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, User } from 'lucide-react';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import PostModel from '@/models/post';
import BlogSettingsModel from '@/models/blog-settings';
import { Metadata } from 'next';

// Função para gerar metadados dinâmicos para a página de categoria
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  
  // Buscar configurações do blog
  await connectToDatabase();
  const settings = await BlogSettingsModel.findOne().lean() || { 
    name: 'Blog Moderno', 
    description: 'Um blog sobre tecnologia e desenvolvimento web' 
  };
  
  // Buscar categoria pelo slug
  const category = await CategoryModel.findOne({ slug }).lean();
  
  if (!category) {
    return {
      title: `Categoria não encontrada | ${settings.name}`,
      description: settings.description,
    };
  }
  
  return {
    title: `${category.name} | ${settings.name}`,
    description: category.description || `Confira todos os posts da categoria ${category.name} em ${settings.name}`,
    openGraph: {
      title: `${category.name} | ${settings.name}`,
      description: category.description || `Confira todos os posts da categoria ${category.name}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category.name} | ${settings.name}`,
      description: category.description || `Confira todos os posts da categoria ${category.name}`,
    }
  };
}

// Função para buscar categoria e posts
async function getCategoryAndPosts(slug: string) {
  await connectToDatabase();
  
  // Buscar categoria pelo slug
  const category = await CategoryModel.findOne({ slug }).lean();
  
  if (!category) {
    return { category: null, posts: [] };
  }
  
  // Buscar posts da categoria
  const posts = await PostModel.find({ 
    category: category._id,
    published: true 
  })
  .sort({ publishedAt: -1, createdAt: -1 })
  .lean();
  
  return { 
    category: {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description
    }, 
    posts: posts.map(post => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
      author: post.author ? {
        name: post.author.name || 'Admin'
      } : { name: 'Admin' }
    }))
  };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { category, posts } = await getCategoryAndPosts(slug);
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Categoria não encontrada</h1>
          <p className="mb-8">A categoria que você está procurando não existe.</p>
          <Link 
            href="/" 
            className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Header da categoria */}
      <section className="py-16 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-gray-600 max-w-3xl">{category.description}</p>
        )}
      </section>

      {/* Lista de posts */}
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post._id} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-48 bg-gray-200 relative">
                  <Image 
                    src={post.coverImage || `/post-placeholder-${Math.floor(Math.random() * 3) + 1}.jpg`}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
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
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-medium mb-2">Nenhum post encontrado</h3>
              <p className="text-gray-600 mb-8">
                Ainda não há posts publicados nesta categoria.
              </p>
              <Link 
                href="/" 
                className="px-6 py-3 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Voltar para a página inicial
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
