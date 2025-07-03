import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongoose';
import PostModel from '@/models/post';
import PageModel from '@/models/page';
import CategoryModel from '@/models/category';

// Forçar que esta rota seja sempre dinâmica e nunca gerada estaticamente
export const dynamic = 'force-dynamic';

/**
 * Endpoint para forçar a atualização do sitemap
 * Este endpoint é útil para depuração e para forçar a atualização do sitemap quando necessário
 */
export async function GET() {
  try {
    await connectToDatabase();
    
    // Contar itens para diagnóstico
    const pagesCount = await PageModel.countDocuments({ isPublished: true });
    const postsCount = await PostModel.countDocuments({ published: true });
    const categoriesCount = await CategoryModel.countDocuments();
    
    // Forçar a revalidação do sitemap
    try {
      revalidatePath('/sitemap.xml', 'layout');
      
      // Aguardar um momento para garantir que a revalidação seja processada
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (revalidateError) {
      console.log('Aviso: Não foi possível revalidar o caminho durante o build, isso é esperado');
      // Continuar mesmo se a revalidação falhar durante o build
    }
    
    return NextResponse.json({
      success: true,
      message: 'Sitemap revalidado com sucesso',
      counts: {
        pages: pagesCount,
        posts: postsCount,
        categories: categoriesCount
      }
    });
  } catch (error) {
    console.error('Erro ao forçar atualização do sitemap:', error);
    return NextResponse.json(
      { error: 'Erro ao forçar atualização do sitemap' },
      { status: 500 }
    );
  }
}
