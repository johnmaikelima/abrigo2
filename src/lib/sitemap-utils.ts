/**
 * Utilitários para gerenciar o sitemap.xml
 * Este arquivo contém funções para atualizar o cache do sitemap quando conteúdo é criado ou excluído
 */

import { revalidatePath } from 'next/cache';

/**
 * Função para atualizar o sitemap após alterações no conteúdo
 * 
 * Esta função força a revalidação do caminho /sitemap.xml e da raiz do site,
 * o que faz com que o Next.js regenere o sitemap com os dados mais recentes.
 * 
 * Deve ser chamada após qualquer operação que crie, atualize ou exclua
 * conteúdo que deva aparecer no sitemap (páginas, posts, categorias).
 */
export async function updateSitemap() {
  try {
    // Revalidar o caminho do sitemap para forçar sua regeneração
    // Revalidamos tanto o sitemap nativo quanto o endpoint de API
    revalidatePath('/sitemap.xml', 'layout');
    revalidatePath('/api/sitemap.xml', 'layout');
    revalidatePath('/', 'layout');
    
    // Fazer uma chamada direta ao endpoint de API para garantir atualização
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/sitemap/force-update`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        console.log('Endpoint de atualização de sitemap chamado com sucesso');
      }
    } catch (fetchError) {
      console.error('Erro ao chamar endpoint de atualização:', fetchError);
      // Continuar mesmo se houver erro na chamada ao endpoint
    }
    
    // Forçar um pequeno delay para garantir que a revalidação seja processada
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('Sitemap revalidado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao revalidar sitemap:', error);
    return false;
  }
}
