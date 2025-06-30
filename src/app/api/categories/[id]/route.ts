import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import PostModel from '@/models/post';
import { updateSitemap } from '@/lib/sitemap-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const category = await CategoryModel.findById(params.id).lean() as any;
    
    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    
    // Formatar a categoria para o frontend
    const formattedCategory = {
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    };
    
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error('Erro ao buscar categoria:', error);
    return NextResponse.json({ error: 'Erro ao buscar categoria' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Validar dados
    if (!body.name || !body.slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se já existe outra categoria com o mesmo slug
    const existingCategory = await CategoryModel.findOne({
      slug: body.slug,
      _id: { $ne: params.id },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe outra categoria com este slug' },
        { status: 400 }
      );
    }
    
    // Atualizar categoria
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).lean() as any;
    
    if (!updatedCategory) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    
    // Atualizar o sitemap após modificar a categoria
    await updateSitemap();
    
    // Formatar a categoria para o frontend
    const formattedCategory = {
      _id: updatedCategory._id.toString(),
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      description: updatedCategory.description || ''
    };
    
    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return NextResponse.json({ error: 'Erro ao atualizar categoria' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    // Verificar se a categoria existe
    const category = await CategoryModel.findById(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });
    }
    
    // Verificar se há posts usando esta categoria
    const postsUsingCategory = await PostModel.countDocuments({ category: params.id });
    if (postsUsingCategory > 0) {
      return NextResponse.json(
        { error: 'Esta categoria está sendo usada em posts e não pode ser excluída' },
        { status: 400 }
      );
    }
    
    // Excluir categoria
    await CategoryModel.findByIdAndDelete(params.id);
    
    // Atualizar o sitemap após excluir a categoria
    await updateSitemap();
    
    return NextResponse.json({ message: 'Categoria excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    return NextResponse.json({ error: 'Erro ao excluir categoria' }, { status: 500 });
  }
}
