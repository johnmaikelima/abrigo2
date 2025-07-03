import { NextRequest, NextResponse } from 'next/server';
import { generateSitemapXml } from '../generate/route';

// GET /api/sitemap/test - Testar geração do sitemap sem autenticação
export async function GET(req: NextRequest) {
  try {
    const xml = await generateSitemapXml();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sitemap gerado com sucesso para teste' 
    });
  } catch (error) {
    console.error('Erro ao gerar sitemap para teste:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar sitemap para teste' }, 
      { status: 500 }
    );
  }
}
