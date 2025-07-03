import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import PageModel from '@/models/page';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import RootLayout from './layout-root';

// Importar componentes de conteúdo
import MainPage from '@/app/main/page';
import { PageRenderer } from '@/components/page-sections/page-renderer';

export default async function RootPage() {
  // Buscar configurações do blog para determinar a página inicial
  await connectToDatabase();
  const settings = await BlogSettingsModel.findOne().lean();
  
  // Se não houver configurações ou a página inicial for padrão, mostrar a página principal
  if (!settings || !settings.homePage || settings.homePage.type === 'default' || !settings.homePage.slug) {
    return <RootLayout><MainPage /></RootLayout>;
  }
  
  // Renderizar o conteúdo com base no tipo de página inicial configurada
  switch (settings.homePage.type) {
    case 'page': {
      // Buscar a página pelo slug
      const page = await PageModel.findOne({ slug: settings.homePage.slug, isPublished: true }).lean();
      if (!page) return <RootLayout><MainPage /></RootLayout>;
      
      // Renderizar o conteúdo da página
      return (
        <RootLayout>
          <main>
            <PageRenderer sections={page.sections || []} />
          </main>
        </RootLayout>
      );
    }
    
    case 'post': {
      // Buscar o post pelo slug
      const post = await PostModel.findOne({ slug: settings.homePage.slug, published: true }).lean();
      if (!post) return <RootLayout><MainPage /></RootLayout>;
      
      // Formatar o post para exibição
      const formattedPost = {
        title: post.title,
        content: post.content,
        coverImage: post.coverImage,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt
      };
      
      // Renderizar o conteúdo do post
      return (
        <RootLayout>
          <div className="bg-gray-50 text-gray-900 min-h-screen py-10">
            <div className="max-w-3xl mx-auto px-6">
              <article>
                <h1 className="text-4xl font-bold mb-4 leading-tight">
                  {formattedPost.title}
                </h1>

                {formattedPost.coverImage && (
                  <div className="mb-6 overflow-hidden rounded-lg">
                    <img 
                      src={formattedPost.coverImage} 
                      alt={formattedPost.title}
                      className="w-full h-auto object-cover rounded-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-6 text-gray-500 text-sm">
                  <time dateTime={new Date(formattedPost.createdAt).toISOString()}>
                    {new Date(formattedPost.createdAt).toLocaleDateString('pt-BR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </time>
                </div>

                <div className="bg-white rounded-lg p-8 shadow-sm leading-relaxed text-lg">
                  <div 
                    className="blog-content" 
                    dangerouslySetInnerHTML={{ __html: formattedPost.content }}
                  />
                </div>
              </article>
            </div>
          </div>
        </RootLayout>
      );
    }
    
    case 'category': {
      // Buscar a categoria pelo slug
      const category = await CategoryModel.findOne({ slug: settings.homePage.slug }).lean();
      if (!category) return <RootLayout><MainPage /></RootLayout>;
      
      // Buscar posts da categoria
      const posts = await PostModel.find({ 
        category: category._id,
        published: true 
      })
      .sort({ publishedAt: -1, createdAt: -1 })
      .lean();
      
      const formattedCategory = {
        name: category.name,
        description: category.description || ''
      };
      
      const formattedPosts = posts.map((post: any) => ({
        _id: post._id.toString(),
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        createdAt: post.createdAt,
        publishedAt: post.publishedAt
      }));
      
      // Renderizar a página de categoria
      return (
        <RootLayout>
          <div className="container mx-auto px-4">
            {/* Header da categoria */}
            <section className="py-16 border-b border-gray-200">
              <h1 className="text-4xl font-bold mb-4">{formattedCategory.name}</h1>
              {formattedCategory.description && (
                <p className="text-xl text-gray-600 max-w-3xl">{formattedCategory.description}</p>
              )}
            </section>

            {/* Lista de posts */}
            <section className="py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formattedPosts.length > 0 ? (
                  formattedPosts.map((post) => (
                    <div 
                      key={post._id} 
                      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="h-48 bg-gray-200 relative">
                        <img 
                          src={post.coverImage || `/post-placeholder-${Math.floor(Math.random() * 3) + 1}.jpg`}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors">
                          <a href={`/blog/${post.slug}`}>
                            {post.title}
                          </a>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <a 
                            href={`/blog/${post.slug}`} 
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            Ler mais
                          </a>
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
                  </div>
                )}
              </div>
            </section>
          </div>
        </RootLayout>
      );
    }
    
    default:
      return <RootLayout><MainPage /></RootLayout>;
  }
}
