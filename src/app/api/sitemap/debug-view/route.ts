import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import PageModel from '@/models/page';
import CategoryModel from '@/models/category';

/**
 * Endpoint para visualizar os dados do sitemap em formato JSON
 * Útil para depuração e verificação dos dados que serão incluídos no sitemap
 */
export async function GET() {
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
    
    // Mapear páginas personalizadas para o formato do sitemap
    const customPages = pages.map(page => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
      priority: 0.8,
      title: page.title,
      isPublished: page.isPublished
    }));
    
    // Buscar todas as categorias
    const categories = await CategoryModel.find({}).lean();
    
    // Mapear categorias para o formato do sitemap
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categorias/${category.slug}`,
      lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
      priority: 0.7,
      name: category.name
    }));
    
    // Buscar todos os posts publicados
    const posts = await PostModel.find({ published: true }).lean();
    
    // Mapear posts para o formato do sitemap
    const postPages = posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
      priority: 0.6,
      title: post.title,
      published: post.published
    }));
    
    // Retornar os dados em formato JSON para depuração
    return NextResponse.json({
      counts: {
        staticPages: staticPages.length,
        customPages: customPages.length,
        categoryPages: categoryPages.length,
        postPages: postPages.length,
        total: staticPages.length + customPages.length + categoryPages.length + postPages.length
      },
      data: {
        staticPages,
        customPages,
        categoryPages,
        postPages
      }
    });
  } catch (error) {
    console.error('Erro ao gerar dados do sitemap:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar dados do sitemap' },
      { status: 500 }
    );
  }
}
