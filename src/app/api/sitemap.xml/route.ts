import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import PageModel from '@/models/page';
import CategoryModel from '@/models/category';

// Forçar que esta rota seja sempre dinâmica e nunca gerada estaticamente
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Desabilitar cache

/**
 * Endpoint para gerar o sitemap.xml diretamente via API
 * Esta abordagem pode ser mais confiável em alguns casos do que a implementação nativa do Next.js
 */
export async function GET() {
  try {
    await connectToDatabase();
    
    // Obter a URL base do site
    // Verificar várias fontes para determinar a URL correta
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || '';
    
    // Se estiver na Vercel, garantir que a URL esteja formatada corretamente
    if (process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    
    // Se estiver em produção com um domínio personalizado via VERCEL_ENV
    if (process.env.VERCEL_ENV === 'production' && process.env.NEXT_PUBLIC_DOMAIN) {
      baseUrl = `https://${process.env.NEXT_PUBLIC_DOMAIN}`;
    }
    
    // Fallback para localhost apenas se nenhuma das opções acima estiver disponível
    if (!baseUrl) {
      baseUrl = 'http://localhost:3000';
    }
    
    console.log('URL base para sitemap:', baseUrl);
    
    // Data atual para lastmod
    const now = new Date().toISOString();
    
    // Iniciar a construção do XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Páginas estáticas
    const staticPages = [
      { url: baseUrl, priority: '1.0' },
      { url: `${baseUrl}/sobre`, priority: '0.8' },
      { url: `${baseUrl}/contato`, priority: '0.8' },
    ];
    
    // Adicionar páginas estáticas ao XML
    for (const page of staticPages) {
      xml += '  <url>\n';
      xml += `    <loc>${page.url}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }
    
    // Buscar todas as páginas personalizadas publicadas
    const pages = await PageModel.find({ isPublished: true }).lean();
    console.log(`Encontradas ${pages.length} páginas publicadas para o sitemap`);
    
    // Adicionar páginas personalizadas ao XML
    for (const page of pages) {
      const lastmod = page.updatedAt ? new Date(page.updatedAt).toISOString() : now;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/${page.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    // Buscar todas as categorias
    const categories = await CategoryModel.find({}).lean();
    console.log(`Encontradas ${categories.length} categorias para o sitemap`);
    
    // Adicionar categorias ao XML
    for (const category of categories) {
      const lastmod = category.updatedAt ? new Date(category.updatedAt).toISOString() : now;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/categorias/${category.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }
    
    // Buscar todos os posts publicados
    const posts = await PostModel.find({ published: true }).lean();
    console.log(`Encontrados ${posts.length} posts publicados para o sitemap`);
    
    // Adicionar posts ao XML
    for (const post of posts) {
      const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : now;
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/blog/${post.slug}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    }
    
    // Finalizar o XML
    xml += '</urlset>';
    
    // Retornar o XML com o tipo de conteúdo apropriado
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Erro ao gerar sitemap XML:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar sitemap XML' },
      { status: 500 }
    );
  }
}
