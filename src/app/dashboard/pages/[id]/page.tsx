'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Trash, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PageRenderer } from '@/components/page-sections/page-renderer';
import { SectionEditor } from '@/components/section-editor';

interface Section {
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  items?: any[];
  order?: number;
}

interface Page {
  _id: string;
  title: string;
  slug: string;
  description: string;
  sections: Section[];
  isPublished: boolean;
  metaTags: {
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function EditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState<Page | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [sectionsJson, setSectionsJson] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/pages/${params.id}`);
        
        if (!res.ok) {
          throw new Error('Falha ao carregar a página');
        }
        
        const data = await res.json();
        if (data && data.page) {
          setPage(data.page);
          // Verificar se sections existe antes de tentar converter para JSON
          if (data.page.sections) {
            setSectionsJson(JSON.stringify(data.page.sections, null, 2));
          } else {
            // Se não existir, inicializar com um array vazio
            setSectionsJson(JSON.stringify([], null, 2));
          }
        } else {
          throw new Error('Dados da página inválidos');
        }
      } catch (err: any) {
        console.error('Erro ao carregar página:', err);
        toast.error('Erro ao carregar página');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPage();
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('metaTags.')) {
      const metaTagName = name.split('.')[1];
      setPage(prev => prev ? {
        ...prev,
        metaTags: {
          ...prev.metaTags,
          [metaTagName]: value
        }
      } : null);
    } else {
      setPage(prev => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSectionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSectionsJson(e.target.value);
    try {
      const parsedSections = JSON.parse(e.target.value);
      setPage(prev => prev ? { ...prev, sections: parsedSections } : null);
      setError('');
    } catch (err) {
      setError('JSON inválido para as seções');
    }
  };
  
  // Manipular mudanças do editor visual de seções
  const handleSectionsUpdate = (updatedSections: any[]) => {
    setPage(prev => prev ? { ...prev, sections: updatedSections } : null);
    setSectionsJson(JSON.stringify(updatedSections, null, 2));
    setError('');
  };

  const handleSave = async () => {
    if (!page) return;
    
    try {
      setSaving(true);
      
      // Validar JSON das seções
      let parsedSections;
      try {
        parsedSections = JSON.parse(sectionsJson);
      } catch (err) {
        toast.error('JSON inválido para as seções');
        setError('JSON inválido para as seções');
        setSaving(false);
        return;
      }
      
      const updatedPage = {
        ...page,
        sections: parsedSections
      };
      
      const res = await fetch(`/api/pages/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPage)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao salvar a página');
      }
      
      toast.success('Página salva com sucesso');
      router.refresh();
    } catch (err: any) {
      console.error('Erro ao salvar página:', err);
      toast.error(err.message || 'Erro ao salvar página');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!page) return;
    
    try {
      setSaving(true);
      
      const updatedPage = {
        ...page,
        isPublished: !page.isPublished
      };
      
      const res = await fetch(`/api/pages/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPage)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao atualizar status da página');
      }
      
      setPage(prev => prev ? { ...prev, isPublished: !prev.isPublished } : null);
      toast.success(`Página ${page.isPublished ? 'despublicada' : 'publicada'} com sucesso`);
    } catch (err: any) {
      console.error('Erro ao atualizar status:', err);
      toast.error(err.message || 'Erro ao atualizar status');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      setSaving(true);
      
      const res = await fetch(`/api/pages/${params.id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Falha ao excluir a página');
      }
      
      toast.success('Página excluída com sucesso');
      router.push('/dashboard/pages');
    } catch (err: any) {
      console.error('Erro ao excluir página:', err);
      toast.error(err.message || 'Erro ao excluir página');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !page) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => router.push('/dashboard/pages')}>
                Voltar para lista de páginas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-muted-foreground mb-4">Página não encontrada</p>
              <Button onClick={() => router.push('/dashboard/pages')}>
                Voltar para lista de páginas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/pages">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Editar Página</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePublishToggle}
            disabled={saving}
          >
            {page.isPublished ? 'Despublicar' : 'Publicar'}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <Link href={`/${page.slug}`} target="_blank">
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDelete}
            disabled={saving}
          >
            <Trash className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="editor">Editor Visual</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="preview">Visualização</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      name="title"
                      value={page.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={page.slug}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={page.description}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sections">
                      Seções (JSON)
                      {error && <span className="text-red-500 ml-2 text-sm">{error}</span>}
                    </Label>
                    <Textarea
                      id="sections"
                      value={sectionsJson}
                      onChange={handleSectionsChange}
                      rows={10}
                      className="font-mono text-sm"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Edite as seções da página em formato JSON
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="editor" className="space-y-4">
              {page && (
                <SectionEditor 
                  sections={page.sections || []} 
                  onChange={handleSectionsUpdate} 
                />
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo Avançado</CardTitle>
                  <CardDescription>
                    Edite as seções da página em formato JSON (avançado)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="sections">Seções (JSON)</Label>
                    <Textarea
                      id="sections"
                      value={sectionsJson}
                      onChange={handleSectionsChange}
                      rows={15}
                      className="font-mono text-sm"
                    />
                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                    <p className="text-sm text-muted-foreground mt-1">
                      Edite as seções da página em formato JSON (para usuários avançados)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de SEO</CardTitle>
                  <CardDescription>
                    Otimize sua página para mecanismos de busca
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaDescription">Meta Descrição</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaTags.description"
                        value={page.metaTags?.description || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Descrição para mecanismos de busca"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords">Palavras-chave</Label>
                      <Input
                        id="metaKeywords"
                        name="metaTags.keywords"
                        value={page.metaTags?.keywords || ''}
                        onChange={handleInputChange}
                        placeholder="palavra1,palavra2,palavra3"
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="ogTitle">Título Open Graph</Label>
                      <Input
                        id="ogTitle"
                        name="metaTags.ogTitle"
                        value={page.metaTags?.ogTitle || ''}
                        onChange={handleInputChange}
                        placeholder="Título para compartilhamento em redes sociais"
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="ogDescription">Descrição Open Graph</Label>
                      <Textarea
                        id="ogDescription"
                        name="metaTags.ogDescription"
                        value={page.metaTags?.ogDescription || ''}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Descrição para compartilhamento em redes sociais"
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <Label htmlFor="ogImage">Imagem Open Graph (URL)</Label>
                      <Input
                        id="ogImage"
                        name="metaTags.ogImage"
                        value={page.metaTags?.ogImage || ''}
                        onChange={handleInputChange}
                        placeholder="https://exemplo.com/imagem.jpg"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Visualização da Página</CardTitle>
                  <CardDescription>
                    Veja como sua página ficará para os visitantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 bg-white">
                    <h1 className="text-2xl font-bold mb-2">{page?.title || 'Sem título'}</h1>
                    <p className="text-gray-500 mb-6">{page?.description || 'Sem descrição'}</p>
                    
                    <div className="preview-container">
                      {page?.sections && page.sections.length > 0 ? (
                        <PageRenderer sections={page.sections} />
                      ) : (
                        <p className="text-muted-foreground text-center py-10">
                          Nenhuma seção adicionada ainda
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    URL: <code>/{page?.slug || ''}</code>
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${page?.slug || ''}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver página completa
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm">
                    {page?.isPublished ? (
                      <span className="text-green-500 font-medium">Publicada</span>
                    ) : (
                      <span className="text-amber-500 font-medium">Rascunho</span>
                    )}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">URL</p>
                  <p className="text-sm">
                    <code>/{page?.slug || ''}</code>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Criada em</p>
                  <p className="text-sm">
                    {page?.createdAt ? new Date(page.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Última atualização</p>
                  <p className="text-sm">
                    {page?.updatedAt ? new Date(page.updatedAt).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Número de seções</p>
                  <p className="text-sm">
                    {page?.sections?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link href={`/${page?.slug || ''}`} target="_blank">
                  <Eye className="h-4 w-4 mr-2" />
                  Visualizar página
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
