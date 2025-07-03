import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import mongoose from 'mongoose';
import { generateSitemapXml } from '../../sitemap/generate/route';

interface MongooseDocument {
  _id: mongoose.Types.ObjectId;
  [key: string]: any;
}

// GET /api/posts/[id] - Obter um post específico por ID ou slug
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;
    let post: MongooseDocument | null;
    
    // Verificar se o ID é um slug ou um ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      // Buscar por slug
      post = await PostModel.findOne({ slug: id })
        .populate('category', 'name slug')
        .lean() as MongooseDocument | null;
    } else {
      // Buscar por ID
      post = await PostModel.findById(id)
        .populate('category', 'name slug')
        .lean() as MongooseDocument | null;
    }
    
    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }
    
    // Formatar o post para o formato esperado pelo frontend
    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published,
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      createdAt: new Date(post.createdAt).toISOString(),
      updatedAt: new Date(post.updatedAt).toISOString(),
      author: {
        name: 'Usuário do Sistema',
        email: 'sistema@example.com'
      },
      tags: post.tags || [],
      category: post.category ? post.category.name : 'Sem categoria'
    };
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[id] - Atualizar um post específico
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;
    const body = await request.json();
    
    // Validar dados mínimos
    if (!body.title && !body.content && !body.excerpt) {
      return NextResponse.json(
        { error: 'Nenhum dado válido fornecido para atualização' },
        { status: 400 }
      );
    }
    
    // Verificar se o post existe
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }
    
    // Se o slug foi alterado, verificar se já existe outro post com esse slug
    if (body.slug && body.slug !== existingPost.slug) {
      const slugExists = await PostModel.findOne({ slug: body.slug, _id: { $ne: id } });
      if (slugExists) {
        return NextResponse.json(
          { error: 'Já existe um post com este slug' },
          { status: 400 }
        );
      }
    }
    
    // Preparar dados para atualização
    const updateData: any = {};
    
    if (body.title) updateData.title = body.title;
    if (body.slug) updateData.slug = body.slug;
    if (body.content) updateData.content = body.content;
    if (body.excerpt) updateData.excerpt = body.excerpt;
    if (body.tags) updateData.tags = body.tags;
    if (body.category) updateData.category = body.category;
    
    // Atualizar status de publicação se fornecido
    if (typeof body.published === 'boolean') {
      updateData.published = body.published;
      
      // Se estiver publicando agora, definir a data de publicação
      if (body.published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
      
      // Se estiver despublicando, remover a data de publicação
      if (!body.published) {
        updateData.publishedAt = null;
      }
    }
    
    // Atualizar post no banco de dados
    const updatedPost = await PostModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('category', 'name slug').lean() as MongooseDocument | null;
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 });
    }
    
    // Formatar o post para o formato esperado pelo frontend
    const formattedPost = {
      id: updatedPost._id.toString(),
      title: updatedPost.title,
      slug: updatedPost.slug,
      content: updatedPost.content,
      excerpt: updatedPost.excerpt,
      published: updatedPost.published,
      publishedAt: updatedPost.publishedAt ? new Date(updatedPost.publishedAt).toISOString() : undefined,
      createdAt: new Date(updatedPost.createdAt).toISOString(),
      updatedAt: new Date(updatedPost.updatedAt).toISOString(),
      author: {
        name: 'Usuário do Sistema',
        email: 'sistema@example.com'
      },
      tags: updatedPost.tags || [],
      category: updatedPost.category ? updatedPost.category.name : 'Sem categoria'
    };
    
    // Gerar o sitemap automaticamente se o post estiver publicado
    if (updatedPost.published) {
      try {
        await generateSitemapXml();
        console.log('Sitemap atualizado após atualização de post');
      } catch (sitemapError) {
        console.error('Erro ao atualizar sitemap:', sitemapError);
        // Não interrompe o fluxo se houver erro na geração do sitemap
      }
    }
    
    return NextResponse.json(formattedPost);
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[id] - Excluir um post específico
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    const id = params.id;
    
    // Verificar se o post existe
    const existingPost = await PostModel.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }
    
    // Excluir post do banco de dados
    const deletedPost = await PostModel.findByIdAndDelete(id).lean() as MongooseDocument | null;
    
    if (!deletedPost) {
      return NextResponse.json({ error: 'Erro ao excluir post' }, { status: 500 });
    }
    
    // Atualizar o sitemap após excluir um post
    try {
      await generateSitemapXml();
      console.log('Sitemap atualizado após exclusão de post');
    } catch (sitemapError) {
      console.error('Erro ao atualizar sitemap após exclusão:', sitemapError);
      // Não interrompe o fluxo se houver erro na geração do sitemap
    }
    
    return NextResponse.json({ 
      message: 'Post excluído com sucesso',
      post: {
        id: deletedPost._id.toString(),
        title: deletedPost.title
      }
    });
  } catch (error) {
    console.error('Erro ao excluir post:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a requisição: ' + (error instanceof Error ? error.message : 'Erro desconhecido') },
      { status: 500 }
    );
  }
}
