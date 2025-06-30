'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Post } from '@/lib/data/posts';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    category: '',
    categoryName: '',
    published: false,
    slug: '',
    coverImage: ''
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Função para gerar slug a partir do título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // Buscar categorias do banco de dados
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Erro ao buscar categorias');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error('Erro ao carregar categorias');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Buscar dados do post
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        // Usar a API que criamos para buscar o post
        const response = await fetch(`/api/posts/${id}`);
        
        if (!response.ok) {
          throw new Error('Post não encontrado');
        }
        
        const post: Post = await response.json();
        
        setFormData({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          tags: post.tags.join(','),
          category: post.category,
          categoryName: post.categoryName || '',
          published: post.published,
          slug: post.slug,
          coverImage: post.coverImage || ''
        });
        
        if (post.coverImage) {
          setThumbnailPreview(post.coverImage);
        }
      } catch (error) {
        console.error('Erro ao buscar post:', error);
        toast.error('Post não encontrado');
        router.push('/dashboard/posts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPostData();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setThumbnailFile(file);
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const uploadThumbnail = async () => {
    if (!thumbnailFile) return null;
    
    const formData = new FormData();
    formData.append('file', thumbnailFile);
    formData.append('type', 'post');
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem');
      }
      
      const data = await response.json();
      return data.fileUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Fazer upload da thumbnail se houver
      let coverImageUrl = formData.coverImage;
      
      if (thumbnailFile) {
        try {
          coverImageUrl = await uploadThumbnail();
        } catch (error) {
          toast.error('Erro ao fazer upload da imagem. O post será salvo sem a imagem.');
          console.error('Erro no upload:', error);
        }
      }
      
      // Preparar os dados do post para enviar à API
      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        category: formData.category,
        published: formData.published,
        coverImage: coverImageUrl
      };
      
      // Enviar para a API
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao atualizar post');
      }
      
      const updatedPost = await response.json();
      console.log('Post atualizado:', updatedPost);
      
      toast.success('Post atualizado com sucesso!');
      router.push('/dashboard/posts');
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast.error(`Erro ao atualizar post: ${error instanceof Error ? error.message : 'Tente novamente'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#111827' }}>
        Carregando...
      </div>
    );
  }

  return (
    <div style={{ color: '#111827' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
          <Button
            onClick={() => router.back()}
            style={{ 
              backgroundColor: 'transparent',
              color: '#4b5563',
              border: 'none',
              padding: '8px',
              marginRight: '16px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Editar Post</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="title" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                placeholder="Digite o título do post"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="thumbnail" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Thumbnail
              </label>
              
              <div style={{ 
                border: '1px dashed #d1d5db', 
                borderRadius: '6px', 
                padding: '20px',
                backgroundColor: '#f9fafb',
                textAlign: 'center',
                marginBottom: '10px'
              }}>
                {thumbnailPreview ? (
                  <div style={{ position: 'relative', width: '100%', height: '200px', marginBottom: '10px' }}>
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      style={{ 
                        width: '100%', 
                        height: '200px', 
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#6b7280',
                    padding: '20px'
                  }}>
                    <ImageIcon size={48} style={{ marginBottom: '10px', opacity: 0.7 }} />
                    <p>Nenhuma imagem selecionada</p>
                  </div>
                )}
                
                <label 
                  htmlFor="thumbnail-input" 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={16} />
                  {thumbnailPreview ? 'Trocar imagem' : 'Fazer upload'}
                </label>
                <input
                  type="file"
                  id="thumbnail-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
                  Formatos aceitos: JPG, PNG, GIF, WEBP. Tamanho máximo: 2MB
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="excerpt" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Resumo
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  minHeight: '80px',
                  resize: 'vertical',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                placeholder="Digite um breve resumo do post"
              />
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Máximo de 300 caracteres
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="content" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Conteúdo
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  minHeight: '300px',
                  resize: 'vertical',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                placeholder="Digite o conteúdo do post"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="categoryId" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Categoria
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Selecione uma categoria</option>
                <option value="Sem categoria">Sem categoria</option>
                {categories.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="tags" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                style={{ 
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  color: '#111827',
                  backgroundColor: 'white'
                }}
                placeholder="Digite as tags separadas por vírgula"
              />
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                Ex: nextjs, react, javascript
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                style={{ 
                  marginRight: '8px',
                  width: '16px',
                  height: '16px'
                }}
              />
              <label 
                htmlFor="published" 
                style={{ 
                  fontWeight: '500',
                  color: '#111827'
                }}
              >
                Publicado
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button
              type="button"
              onClick={() => router.back()}
              style={{ 
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              style={{ 
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              <Save size={16} />
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
  );
}
