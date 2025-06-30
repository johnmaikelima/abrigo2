'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import { Save, Loader2 } from 'lucide-react';

interface BlogSettings {
  homePage: {
    type: string;
    id: string;
    slug: string;
    title: string;
  };
}

interface Page {
  _id: string;
  title: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
}

export default function HomePageSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<BlogSettings>({
    homePage: {
      type: 'default',
      id: '',
      slug: '',
      title: ''
    }
  });
  
  const [pages, setPages] = useState<Page[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  
  // Buscar configurações do blog
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings/blog');
        if (response.ok) {
          const data = await response.json();
          setSettings({
            homePage: data.homePage || {
              type: 'default',
              id: '',
              slug: '',
              title: ''
            }
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Erro ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Buscar páginas, categorias e posts para seleção
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Buscar páginas
        const pagesResponse = await fetch('/api/pages');
        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          setPages(pagesData);
        }
        
        // Buscar categorias
        const categoriesResponse = await fetch('/api/categories');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        // Buscar posts
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Erro ao carregar opções:', error);
        toast.error('Erro ao carregar opções de conteúdo');
      }
    };
    
    fetchOptions();
  }, []);
  
  // Salvar configurações
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ homePage: settings.homePage }),
      });
      
      if (response.ok) {
        toast.success('Configurações da página inicial salvas com sucesso');
      } else {
        toast.error('Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Atualizar o ID, slug e título ao selecionar um item
  const handleItemSelect = (id: string, type: string) => {
    let selectedItem;
    let slug = '';
    let title = '';
    
    if (type === 'page') {
      selectedItem = pages.find(page => page._id === id);
      if (selectedItem) {
        slug = selectedItem.slug;
        title = selectedItem.title;
      }
    } else if (type === 'category') {
      selectedItem = categories.find(category => category._id === id);
      if (selectedItem) {
        slug = selectedItem.slug;
        title = selectedItem.name;
      }
    } else if (type === 'post') {
      selectedItem = posts.find(post => post._id === id);
      if (selectedItem) {
        slug = selectedItem.slug;
        title = selectedItem.title;
      }
    }
    
    setSettings(prev => ({
      ...prev,
      homePage: {
        ...prev.homePage,
        id,
        slug,
        title
      }
    }));
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Página Inicial</CardTitle>
          <CardDescription>
            Configure o que será exibido na página inicial do seu blog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Tipo de Página Inicial</h3>
                <RadioGroup
                  value={settings.homePage.type}
                  onValueChange={(value) => 
                    setSettings(prev => ({
                      ...prev,
                      homePage: {
                        ...prev.homePage,
                        type: value,
                        id: '',
                        slug: '',
                        title: ''
                      }
                    }))
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="default" />
                    <Label htmlFor="default">Página inicial padrão</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="page" id="page" />
                    <Label htmlFor="page">Página específica</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="category" id="category" />
                    <Label htmlFor="category">Categoria</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="post" id="post" />
                    <Label htmlFor="post">Post específico</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {settings.homePage.type === 'page' && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Selecione uma Página</h3>
                  <Select
                    value={settings.homePage.id}
                    onValueChange={(value) => handleItemSelect(value, 'page')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma página" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page) => (
                        <SelectItem key={page._id} value={page._id}>
                          {page.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {settings.homePage.type === 'category' && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Selecione uma Categoria</h3>
                  <Select
                    value={settings.homePage.id}
                    onValueChange={(value) => handleItemSelect(value, 'category')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {settings.homePage.type === 'post' && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Selecione um Post</h3>
                  <Select
                    value={settings.homePage.id}
                    onValueChange={(value) => handleItemSelect(value, 'post')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione um post" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map((post) => (
                        <SelectItem key={post._id} value={post._id}>
                          {post.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="pt-4">
                <Button
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="flex items-center"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
