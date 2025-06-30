import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';

// Configuração para indicar que esta rota é dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET /api/posts/search - Buscar posts pelo título
export async function GET(request: NextRequest) {
  try {
    const searchQuery = request.nextUrl.searchParams.get('q');
    
    if (!searchQuery) {
      return NextResponse.json({ 
        error: 'Parâmetro de busca não fornecido' 
      }, { status: 400 });
    }
    
    await connectToDatabase();
    
    // Buscar posts que correspondem à consulta (case insensitive)
    const posts = await PostModel.find({
      title: { $regex: searchQuery, $options: 'i' },
      published: true // Apenas posts publicados
    })
    .select('_id title slug')
    .limit(10)
    .lean();
    
    // Serializar resultados para evitar problemas com ObjectId
    const serializedResults = posts.map(post => serializeMongoDBObject(post));
    
    return NextResponse.json({ 
      results: serializedResults
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar posts',
      message: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 });
  }
}
