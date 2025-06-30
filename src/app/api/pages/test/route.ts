import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PageModel from '@/models/page';

// Esta é uma rota temporária apenas para teste, sem autenticação

// Rota temporária para teste
export async function GET() {
  try {
    await connectToDatabase();
    const pages = await PageModel.find().lean();
    
    return NextResponse.json({
      success: true,
      count: pages.length,
      pages: pages.map(page => ({
        id: page._id,
        title: page.title,
        slug: page.slug,
        isPublished: page.isPublished
      }))
    });
  } catch (error: any) {
    console.error('Erro ao buscar páginas:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
