import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PageModel from '@/models/page';
import { withAdminAuth } from '@/app/api/users/middleware';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';
import { updateSitemap } from '@/lib/sitemap-utils';

// GET - Buscar uma página específica pelo ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase();
    
    const page = await PageModel.findById(params.id).lean();
    
    if (!page) {
      return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
    }
    
    // Serializar o objeto do MongoDB antes de retornar
    const serializedPage = serializeMongoDBObject(page);
    
    // Retornar o objeto page dentro de um objeto com a propriedade page
    return NextResponse.json({ page: serializedPage });
  } catch (error) {
    console.error('Erro ao buscar página:', error);
    return NextResponse.json({ error: 'Erro ao buscar página' }, { status: 500 });
  }
}

// PUT - Atualizar uma página existente
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const data = await req.json();
      
      // Remover campos que não devem ser atualizados diretamente
      delete data._id;
      delete data.createdAt;
      
      const page = await PageModel.findByIdAndUpdate(
        params.id,
        { $set: data },
        { new: true, runValidators: true }
      ).lean();
      
      if (!page) {
        return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
      }
      
      // Atualizar o sitemap após atualizar a página
      await updateSitemap();
      
      // Serializar o objeto do MongoDB antes de retornar
      const serializedPage = serializeMongoDBObject(page);
      
      return NextResponse.json(serializedPage);
    } catch (error) {
      console.error('Erro ao atualizar página:', error);
      
      // Verificar se é um erro de validação do Mongoose
      if (error.name === 'ValidationError') {
        return NextResponse.json({ error: 'Dados inválidos', details: error.message }, { status: 400 });
      }
      
      // Verificar se é um erro de duplicidade (slug já existe)
      if (error.code === 11000) {
        return NextResponse.json({ error: 'Uma página com este slug já existe' }, { status: 409 });
      }
      
      return NextResponse.json({ error: 'Erro ao atualizar página' }, { status: 500 });
    }
  });
}

// DELETE - Excluir uma página
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const page = await PageModel.findByIdAndDelete(params.id).lean();
      
      if (!page) {
        return NextResponse.json({ error: 'Página não encontrada' }, { status: 404 });
      }
      
      // Atualizar o sitemap após excluir a página
      await updateSitemap();
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      return NextResponse.json({ error: 'Erro ao excluir página' }, { status: 500 });
    }
  });
}
