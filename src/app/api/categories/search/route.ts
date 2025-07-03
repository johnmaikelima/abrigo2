import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import CategoryModel from '@/models/category';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';

// Configuração para indicar que esta rota é dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/categories/search - Buscar categorias pelo nome
export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('q');
    
    if (!searchQuery) {
      return NextResponse.json({ 
        error: 'Parâmetro de busca não fornecido' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Buscar categorias que correspondem à consulta (case insensitive)
    const categories = await CategoryModel.find({
      name: { $regex: searchQuery, $options: 'i' }
    })
    .select('_id name slug')
    .limit(10)
    .lean();
    
    // Serializar resultados para evitar problemas com ObjectId
    const serializedResults = categories.map(category => serializeMongoDBObject(category));
    
    return NextResponse.json({ 
      results: serializedResults
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar categorias',
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 });
  }
}
