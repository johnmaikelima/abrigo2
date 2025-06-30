import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PageModel from '@/models/page';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';

// Configuração para indicar que esta rota é dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/pages/search - Buscar páginas pelo título
export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('q');
    
    if (!searchQuery) {
      return NextResponse.json({ 
        error: 'Parâmetro de busca não fornecido' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Buscar páginas que correspondem à consulta (case insensitive)
    const pages = await PageModel.find({
      title: { $regex: searchQuery, $options: 'i' }
    })
    .select('_id title slug')
    .limit(10)
    .lean();
    
    // Serializar resultados para evitar problemas com ObjectId
    const serializedResults = pages.map(page => serializeMongoDBObject(page));
    
    return NextResponse.json({ 
      results: serializedResults
    });
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar páginas',
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 });
  }
}
