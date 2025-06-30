import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import mongoose from 'mongoose';
import { updateSitemap } from '@/lib/sitemap-utils';

interface MongooseDocument {
  _id: mongoose.Types.ObjectId;
  [key: string]: any;
}

// GET /api/posts - Obter todos os posts
export async function GET(request: Request) {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Obter parâmetros da query
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('category');
    const onlyPublished = url.searchParams.get('published') === 'true';
    
    // Construir filtro com base nos parâmetros
    const filter: any = {};
    
    // Filtrar por categoria se especificada
    if (categoryId) {
      filter.category = categoryId;
    }
    
    // Filtrar por publicação se especificada
    if (onlyPublished) {
      filter.published = true;
    }
    
    // Buscar posts com filtros e popular a categoria
    const posts = await PostModel.find(filter)
      .sort({ createdAt: -1 })
      .populate('category', 'name slug')
      .lean() as MongooseDocument[];
    
    // Formatar os posts para o formato esperado pelo frontend
    const formattedPosts = posts.map(post => ({
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
        name: 'Autor do Sistema', // Temporário até implementarmos autenticação
        email: 'sistema@example.com'
      } : {
        name: 'Usuário do Sistema',
        email: 'sistema@example.com'
      },
      tags: post.tags || [],
      category: post.category ? post.category.name : 'Sem categoria'
    }));
    
    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Criar um novo post
export async function POST(request: Request) {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    const body = await request.json();
    
    // Validar dados do post
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Dados incompletos. Título e conteúdo são obrigatórios.' },
        { status: 400 }
      );
    }
    
    // Verificar se o slug já existe
    if (body.slug) {
      const existingPost = await PostModel.findOne({ slug: body.slug });
      if (existingPost) {
        return NextResponse.json(
          { error: 'Já existe um post com este slug.' },
          { status: 400 }
        );
      }
    }
    
    // Preparar dados do post
    const postData = {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 150) + '...',
      published: body.published || false,
      publishedAt: body.published ? new Date() : undefined,
      tags: body.tags || [],
      category: body.category ? body.category : null,
      author: new mongoose.Types.ObjectId('000000000000000000000000') // Temporário até implementarmos autenticação
    };
    
    // Criar novo post no banco de dados
    const newPost = await PostModel.create(postData);
    const populatedPost = await PostModel.findById(newPost._id)
      .populate('category', 'name slug')
      .lean() as MongooseDocument;
    
    // Formatar o post para o formato esperado pelo frontend
    const formattedPost = {
      id: populatedPost._id.toString(),
      title: populatedPost.title,
      slug: populatedPost.slug,
      content: populatedPost.content,
      excerpt: populatedPost.excerpt,
      published: populatedPost.published,
      publishedAt: populatedPost.publishedAt ? new Date(populatedPost.publishedAt).toISOString() : undefined,
      createdAt: new Date(populatedPost.createdAt).toISOString(),
      updatedAt: new Date(populatedPost.updatedAt).toISOString(),
      author: {
        name: 'Usuário do Sistema',
        email: 'sistema@example.com'
      },
      tags: populatedPost.tags || [],
      category: populatedPost.category ? populatedPost.category.name : 'Sem categoria'
    };
    
    // Atualizar o sitemap automaticamente se o post for publicado
    if (populatedPost.published) {
      try {
        await updateSitemap();
        console.log('Sitemap atualizado após criação de novo post');
      } catch (sitemapError) {
        console.error('Erro ao atualizar sitemap:', sitemapError);
        // Não interrompe o fluxo se houver erro na geração do sitemap
      }
    }
    
    return NextResponse.json(formattedPost, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    );
  }
}
