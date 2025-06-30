import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';
import PageModel from '@/models/page';

// Função para gerar o sitemap usando a API nativa do Next.js
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    await connectToDatabase();
    
    // Obter a URL base do site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Data atual para lastmod
    const now = new Date();
    
    // Páginas estáticas
    const staticPages = [
      {
        url: baseUrl,
        lastModified: now,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/sobre`,
        lastModified: now,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contato`,
        lastModified: now,
        priority: 0.8,
      },
    ];
    
    // Buscar todas as páginas personalizadas publicadas
    const pages = await PageModel.find({ isPublished: true }).lean();
    console.log(`Encontradas ${pages.length} páginas publicadas para o sitemap`);
    
    // Mapear páginas personalizadas para o formato do sitemap
    const customPages = pages.map(page => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
      priority: 0.8,
    }));
    
    // Buscar todas as categorias
    const categories = await CategoryModel.find({}).lean();
    console.log(`Encontradas ${categories.length} categorias para o sitemap`);
    
    // Mapear categorias para o formato do sitemap
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categorias/${category.slug}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
      priority: 0.7,
    }));
    
    // Buscar todos os posts publicados
    const posts = await PostModel.find({ published: true }).lean();
    console.log(`Encontrados ${posts.length} posts publicados para o sitemap`);
    
    // Mapear posts para o formato do sitemap
    const postPages = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      priority: 0.6,
    }));
    
    // Combinar todas as páginas
    const allPages = [...staticPages, ...customPages, ...categoryPages, ...postPages];
    console.log(`Total de ${allPages.length} URLs no sitemap`);
    
    return allPages;
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    // Retornar pelo menos as páginas estáticas em caso de erro
    return [
      {
        url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        lastModified: new Date(),
        priority: 1.0,
      }
    ];
  }
}
