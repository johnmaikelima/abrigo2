'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Post } from '@/lib/data/posts';

// Importamos apenas o tipo Post, mas não as funções,
// pois no client component usaremos fetch para obter os dados

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 30;
  
  // Carregar posts ao inicializar o componente
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Usar a API que criamos
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('Erro ao carregar posts');
        }
        
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, []);
  
  // Função para excluir um post
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        // Mostrar toast de carregamento
        const loadingToast = toast.loading('Excluindo post...');
        
        // Usar a API que criamos para excluir o post
        const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erro ao excluir post');
        }
        
        // Atualizar a lista de posts localmente
        setPosts(posts.filter((post: Post) => post.id !== id));
        
        // Substituir o toast de carregamento por um de sucesso
        toast.dismiss(loadingToast);
        toast.success('Post excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir post:', error);
        toast.error(`Erro ao excluir post: ${error instanceof Error ? error.message : 'Tente novamente'}`);
      }
    }
  };

  return (
    <div style={{ color: '#111827' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Posts</h1>
          <Button 
            onClick={() => router.push('/dashboard/posts/new')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: '#2563eb', 
              color: 'white', 
              padding: '10px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            <Plus size={16} />
            Novo Post
          </Button>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', 
          overflow: 'hidden' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '500', color: '#4b5563' }}>Título</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '500', color: '#4b5563' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '500', color: '#4b5563' }}>Data</th>
                <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '500', color: '#4b5563' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', color: '#111827' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{post.title}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{post.excerpt}</div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#111827' }}>
                      <span style={{ 
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: post.published ? '#dcfce7' : '#f3f4f6',
                        color: post.published ? '#166534' : '#4b5563',
                      }}>
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#111827' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {post.published ? (
                          <>Publicado em: {new Date(post.publishedAt || '').toLocaleDateString('pt-BR')}</>
                        ) : (
                          <>Criado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}</>
                        )}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {post.published && (
                          <Button
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            style={{ 
                              backgroundColor: '#f3f4f6', 
                              color: '#4b5563',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            <Eye size={16} />
                          </Button>
                        )}
                        <Button
                          onClick={() => router.push(`/dashboard/posts/edit/${post.id}`)}
                          style={{ 
                            backgroundColor: '#f3f4f6', 
                            color: '#4b5563',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(post.id)}
                          style={{ 
                            backgroundColor: '#fee2e2', 
                            color: '#b91c1c',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                    Nenhum post encontrado. Crie seu primeiro post!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação - será implementada quando houver mais de 30 posts */}
        {posts.length > postsPerPage && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{ 
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1
                }}
              >
                Anterior
              </Button>
              <span style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '0 16px',
                color: '#111827'
              }}>
                Página {currentPage}
              </span>
              <Button 
                disabled={currentPage * postsPerPage >= posts.length}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{ 
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  cursor: currentPage * postsPerPage >= posts.length ? 'not-allowed' : 'pointer',
                  opacity: currentPage * postsPerPage >= posts.length ? 0.5 : 1
                }}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
  );
}
