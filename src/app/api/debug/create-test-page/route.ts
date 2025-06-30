import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import PageModel from '@/models/page';

// Rota de debug para criar uma página de teste (apenas para desenvolvimento)
export async function GET() {
  try {
    await connectToDatabase();
    
    // Verificar se a página de teste já existe
    const existingPage = await PageModel.findOne({ slug: 'pagina-teste' });
    
    if (existingPage) {
      return NextResponse.json({
        success: true,
        message: 'Página de teste já existe',
        page: {
          id: existingPage._id,
          title: existingPage.title,
          slug: existingPage.slug,
          url: `/${existingPage.slug}`
        }
      });
    }
    
    // Criar uma página de teste
    const testPage = new PageModel({
      title: 'Página de Teste',
      slug: 'pagina-teste',
      description: 'Esta é uma página de teste para verificar o funcionamento do módulo de páginas',
      isPublished: true,
      sections: [
        {
          type: 'hero',
          title: 'Bem-vindo à Página de Teste',
          subtitle: 'Esta página foi criada automaticamente para testes',
          content: '<p>Esta é uma seção hero com <strong>conteúdo HTML</strong> para demonstrar o funcionamento do módulo de páginas.</p>',
          buttonText: 'Saiba mais',
          buttonLink: '#content',
          backgroundColor: '#f8fafc',
          textColor: '#1e293b'
        },
        {
          type: 'content',
          title: 'Conteúdo de Teste',
          content: '<p>Este é um parágrafo de exemplo com <strong>texto em negrito</strong> e <em>texto em itálico</em>.</p><p>Outro parágrafo para demonstrar a formatação HTML.</p><ul><li>Item de lista 1</li><li>Item de lista 2</li><li>Item de lista 3</li></ul>',
          backgroundColor: '#ffffff',
          textColor: '#1e293b'
        },
        {
          type: 'cta',
          title: 'Chamada para Ação',
          content: '<p>Esta é uma seção de chamada para ação com <strong>formatação HTML</strong>.</p>',
          buttonText: 'Contato',
          buttonLink: '#contato',
          backgroundColor: '#2563eb',
          textColor: '#ffffff'
        }
      ],
      metaTags: {
        description: 'Página de teste para o módulo de páginas',
        keywords: 'teste,página,módulo'
      }
    });
    
    await testPage.save();
    
    return NextResponse.json({
      success: true,
      message: 'Página de teste criada com sucesso',
      page: {
        id: testPage._id,
        title: testPage.title,
        slug: testPage.slug,
        url: `/${testPage.slug}`
      }
    });
  } catch (error: any) {
    console.error('Erro ao criar página de teste:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
