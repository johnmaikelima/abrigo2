import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import fs from 'fs';
import path from 'path';

// Configuração da rota usando a nova sintaxe do Next.js App Router
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/sitemap/debug - Depurar geração do sitemap
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Verificar posts publicados
    const publishedPosts = await PostModel.find({ published: true }).lean();
    
    // Verificar todos os posts
    const allPosts = await PostModel.find({}).lean();
    
    // Verificar se o arquivo sitemap.xml existe
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemapExists = fs.existsSync(sitemapPath);
    
    // Ler o conteúdo do sitemap se existir
    let sitemapContent = '';
    if (sitemapExists) {
      sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    }
    
    return NextResponse.json({
      debug: true,
      publishedPostsCount: publishedPosts.length,
      allPostsCount: allPosts.length,
      publishedPosts: publishedPosts.map(post => ({
        id: post._id ? post._id.toString() : 'unknown',
        title: post.title || 'Sem título',
        slug: post.slug || 'sem-slug',
        published: post.published || false,
        publishedAt: post.publishedAt || null
      })),
      sitemapExists,
      sitemapContent: sitemapContent ? sitemapContent.substring(0, 500) + '...' : ''
    });
  } catch (error) {
    console.error('Erro ao depurar sitemap:', error);
    return NextResponse.json(
      { error: 'Erro ao depurar sitemap', message: error instanceof Error ? error.message : 'Erro desconhecido' }, 
      { status: 500 }
    );
  }
}
