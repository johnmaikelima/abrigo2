import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PageModel from '@/models/page';
import { withAdminAuth } from '@/app/api/users/middleware';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';
import { updateSitemap } from '@/lib/sitemap-utils';

// GET - Listar todas as páginas
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Verificar se deve filtrar apenas páginas publicadas
    const { searchParams } = new URL(req.url);
    const onlyPublished = searchParams.get('published') === 'true';
    
    let query = {};
    if (onlyPublished) {
      query = { isPublished: true };
    }
    
    const pages = await PageModel.find(query).sort({ createdAt: -1 }).lean();
    
    // Serializar os objetos do MongoDB antes de retornar
    const serializedPages = serializeMongoDBObject(pages);
    
    return NextResponse.json(serializedPages);
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    return NextResponse.json({ error: 'Erro ao buscar páginas: ' + (error instanceof Error ? error.message : 'Erro desconhecido') }, { status: 500 });
  }
}

// POST - Criar uma nova página
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const data = await req.json();
      
      // Criar slug a partir do título se não for fornecido
      if (!data.slug && data.title) {
        data.slug = data.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }
      
      const page = new PageModel(data);
      await page.save();
      
      // Atualizar o sitemap após criar uma nova página
      await updateSitemap();
      
      // Serializar o objeto do MongoDB antes de retornar
      const serializedPage = serializeMongoDBObject(page.toObject());
      
      return NextResponse.json(serializedPage, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar página:', error);
      
      // Verificar se é um erro de validação do Mongoose
      if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ error: 'Dados inválidos', details: error.message }, { status: 400 });
      }
      
      // Verificar se é um erro de duplicidade (slug já existe)
      if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
        return NextResponse.json({ error: 'Uma página com este slug já existe' }, { status: 409 });
      }
      
      return NextResponse.json({ error: 'Erro ao criar página' }, { status: 500 });
    }
  });
}
