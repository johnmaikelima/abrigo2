import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';

// GET /api/categories/by-slug/[slug]
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectToDatabase();
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug da categoria é obrigatório' },
        { status: 400 }
      );
    }

    const category = await CategoryModel.findOne({ slug }).lean() as any;

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 404 }
      );
    }

    // Formatar a resposta para o frontend
    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      createdAt: category.createdAt ? new Date(category.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: category.updatedAt ? new Date(category.updatedAt).toISOString() : new Date().toISOString(),
    });
  } catch (error) {
    console.error('Erro ao buscar categoria por slug:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar categoria' },
      { status: 500 }
    );
  }
}
