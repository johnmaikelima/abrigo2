import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';

// Função para gerar o sitemap XML sem autenticação
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Obter a URL base do site
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    // Data atual para lastmod
    const now = new Date().toISOString();
    
    // Iniciar o XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Adicionar a página inicial
    xml += `  <url>\n    <loc>${baseUrl}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>1.0</priority>\n  </url>\n`;
    
    // Adicionar a página sobre
    xml += `  <url>\n    <loc>${baseUrl}/sobre</loc>\n    <lastmod>${now}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    
    // Adicionar a página de contato
    xml += `  <url>\n    <loc>${baseUrl}/contato</loc>\n    <lastmod>${now}</lastmod>\n    <priority>0.8</priority>\n  </url>\n`;
    
    // Buscar todas as categorias
    const categories = await CategoryModel.find({}).lean();
    
    // Adicionar páginas de categorias
    for (const category of categories) {
      const slug = category.slug;
      xml += `  <url>\n    <loc>${baseUrl}/categoria/${slug}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>0.7</priority>\n  </url>\n`;
    }
    
    // Buscar todos os posts publicados
    console.log('Buscando posts publicados...');
    const posts = await PostModel.find({ published: true }).lean();
    console.log(`Encontrados ${posts.length} posts publicados`);
    
    // Adicionar páginas de posts
    for (const post of posts) {
      const slug = post.slug;
      const lastmod = post.updatedAt ? new Date(post.updatedAt).toISOString() : now;
      xml += `  <url>\n    <loc>${baseUrl}/post/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>0.6</priority>\n  </url>\n`;
    }
    
    // Fechar o XML
    xml += '</urlset>';
    
    // Caminho para salvar o sitemap
    const publicDir = path.join(process.cwd(), 'public');
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    
    // Garantir que o diretório public existe
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Salvar o arquivo
    fs.writeFileSync(sitemapPath, xml);
    
    // Retornar informações de diagnóstico
    return NextResponse.json({ 
      success: true, 
      message: 'Sitemap gerado com sucesso',
      postsCount: posts.length,
      categoriesCount: categories.length,
      sitemapPath: sitemapPath
    });
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar sitemap', message: error instanceof Error ? error.message : 'Erro desconhecido' }, 
      { status: 500 }
    );
  }
}
