import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import { updateSitemap } from '@/lib/sitemap-utils';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await CategoryModel.find().sort({ name: 1 }).lean();
    
    // Formatar as categorias para o frontend
    const formattedCategories = categories.map((category: any) => ({
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ error: 'Erro ao buscar categorias' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    
    // Verificar se já existe uma categoria com o mesmo slug
    const existingCategory = await CategoryModel.findOne({ slug: body.slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este slug' },
        { status: 400 }
      );
    }
    
    // Criar nova categoria
    const category = await CategoryModel.create(body);
    
    // Atualizar o sitemap após criar uma nova categoria
    await updateSitemap();
    
    // Formatar a resposta para o frontend
    const formattedCategory = {
      _id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    };
    
    return NextResponse.json(formattedCategory, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return NextResponse.json({ error: 'Erro ao criar categoria' }, { status: 500 });
  }
}
