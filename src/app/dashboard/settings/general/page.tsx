'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { Save, Upload, Loader2, Search, Home } from 'lucide-react';
import Image from 'next/image';
import InputMask from 'react-input-mask';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BlogSettings {
  name: string;
  description: string;
  logo: string;
  favicon: string;
  defaultAuthorName: string;
  defaultAuthorEmail: string;
  
  // Informações de contato
  contactEmail: string;
  contactPhone: string;
  contactWhatsapp: string;
  
  // Configuração do botão WhatsApp
  whatsappConfig: {
    number: string;
    message: string;
    hoverText: string;
    enabled: boolean;
  };
  
  // Endereço
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  
  // Redes sociais
  socialMedia: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
  
  // Página inicial
  homePage: {
    type: string; // 'default', 'page', 'category', 'post'
    id: string;
    slug: string;
    title: string;
  };
}

export default function GeneralSettingsPage() {
  const [settings, setSettings] = useState<BlogSettings>({
    name: '',
    description: '',
    logo: '',
    favicon: '',
    defaultAuthorName: '',
    defaultAuthorEmail: '',
    contactEmail: '',
    contactPhone: '',
    contactWhatsapp: '',
    whatsappConfig: {
      number: '',
      message: 'Olá! Vim pelo site e gostaria de algumas informações.',
      hoverText: 'Precisa de ajuda? Fale conosco!',
      enabled: false
    },
    address: {
      street: '',
      number: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    homePage: {
      type: 'default',
      id: '',
      slug: '',
      title: ''
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{id: string, title: string, slug: string, type: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Carregar configurações ao montar o componente
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/settings/blog');
        if (!response.ok) {
          throw new Error('Erro ao carregar configurações');
        }
        const data = await response.json();
        
        // Verificar se os dados estão no formato esperado e extrair settings
        if (data.success && data.settings) {
          // Garantir que homePage existe
          const settingsData = {
            ...data.settings,
            homePage: data.settings.homePage || {
              type: 'default',
              id: '',
              slug: '',
              title: ''
            }
          };
          setSettings(settingsData);
        } else {
          // Se os dados não estiverem no formato esperado, usar diretamente
          // Garantir que homePage existe
          const settingsData = {
            ...data,
            homePage: data.homePage || {
              type: 'default',
              id: '',
              slug: '',
              title: ''
            }
          };
          setSettings(settingsData);
        }
        
        console.log('Dados carregados:', data);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Não foi possível carregar as configurações do blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Função para salvar as configurações
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao salvar configurações');
      }

      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  // Função para fazer upload da logo
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'logo');
    
    setIsUploading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao fazer upload da logo');
      }

      const data = await response.json();
      setSettings(prev => ({
        ...prev,
        logo: data.fileUrl
      }));
      
      toast.success('Logo enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da logo:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload da logo');
    } finally {
      setIsUploading(false);
    }
  };

  // Função para abrir o seletor de arquivo
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para atualizar campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Função para atualizar campos de redes sociais
  const handleSocialMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const socialField = name.split('.')[1]; // Ex: socialMedia.facebook -> facebook
    
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [socialField]: value
      }
    }));
  };
  
  // Função para atualizar campos de endereço
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const field = name.split('.')[1]; // Ex: address.street -> street
    
    setSettings(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  // Função para atualizar campos de configuração do WhatsApp
  const handleWhatsappConfigChange = (
    fieldOrEvent: string | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    valueParam?: string
  ) => {
    // Verificar se é um evento ou um par campo/valor
    if (typeof fieldOrEvent === 'string') {
      // Caso direto: campo e valor passados como parâmetros
      const field = fieldOrEvent;
      const value = valueParam || '';
      
      setSettings(prev => ({
        ...prev,
        whatsappConfig: {
          ...prev.whatsappConfig,
          [field]: value
        }
      }));
    } else {
      // Caso de evento: extrair campo e valor do evento
      const { name, value } = fieldOrEvent.target;
      const field = name.split('.')[1]; // Exemplo: whatsappConfig.number -> number
      
      setSettings(prev => ({
        ...prev,
        whatsappConfig: {
          ...prev.whatsappConfig,
          [field]: value
        }
      }));
    }
  };

  // Função para alternar a ativação do botão WhatsApp
  const toggleWhatsappEnabled = () => {
    setSettings(prev => ({
      ...prev,
      whatsappConfig: {
        ...prev.whatsappConfig,
        enabled: !prev.whatsappConfig.enabled
      }
    }));
  };

  // Função para atualizar o tipo de página inicial
  const handleHomePageTypeChange = (value: string) => {
    setSettings(prev => {
      // Garantir que homePage existe
      const currentHomePage = prev.homePage || {
        type: 'default',
        id: '',
        slug: '',
        title: ''
      };
      
      return {
        ...prev,
        homePage: {
          ...currentHomePage,
          type: value,
          // Resetar os outros valores quando mudar o tipo
          id: value === 'default' ? '' : currentHomePage.id,
          slug: value === 'default' ? '' : currentHomePage.slug,
          title: value === 'default' ? '' : currentHomePage.title
        }
      };
    });
    
    // Limpar resultados de busca ao mudar o tipo
    setSearchResults([]);
    setSearchQuery('');
  };

  // Função para buscar páginas, posts ou categorias
  const handleSearch = async () => {
    if (!searchQuery.trim() || !settings.homePage.type || settings.homePage.type === 'default') return;
    
    setIsSearching(true);
    try {
      let endpoint = '';
      
      switch (settings.homePage.type) {
        case 'page':
          endpoint = '/api/pages/search?q=' + encodeURIComponent(searchQuery);
          break;
        case 'post':
          endpoint = '/api/posts/search?q=' + encodeURIComponent(searchQuery);
          break;
        case 'category':
          endpoint = '/api/categories/search?q=' + encodeURIComponent(searchQuery);
          break;
      }
      
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('Falha na busca');
      
      const data = await response.json();
      setSearchResults(data.results.map((item: any) => ({
        id: item._id || item.id,
        title: item.title || item.name,
        slug: item.slug,
        type: settings.homePage.type
      })));
    } catch (error) {
      console.error('Erro na busca:', error);
      toast.error('Erro ao buscar conteúdo');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Função para selecionar um item como página inicial
  const handleSelectHomePageItem = (item: {id: string, title: string, slug: string, type: string}) => {
    setSettings(prev => ({
      ...prev,
      homePage: {
        ...prev.homePage,
        id: item.id,
        slug: item.slug,
        title: item.title
      }
    }));
    
    toast.success(`${item.title} definido como página inicial`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Carregando configurações...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Configurações Gerais</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Página Inicial
            </CardTitle>
            <CardDescription>
              Configure qual conteúdo será exibido como página inicial do seu site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Tipo de página inicial</Label>
              <RadioGroup 
                value={settings.homePage?.type || 'default'} 
                onValueChange={handleHomePageTypeChange}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                  <RadioGroupItem value="default" id="default" />
                  <Label htmlFor="default" className="cursor-pointer flex-1">Padrão</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                  <RadioGroupItem value="page" id="page" />
                  <Label htmlFor="page" className="cursor-pointer flex-1">Página</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                  <RadioGroupItem value="post" id="post" />
                  <Label htmlFor="post" className="cursor-pointer flex-1">Post</Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-4 hover:bg-gray-50">
                  <RadioGroupItem value="category" id="category" />
                  <Label htmlFor="category" className="cursor-pointer flex-1">Categoria</Label>
                </div>
              </RadioGroup>
            </div>
            
            {settings.homePage.type !== 'default' && (
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="searchContent">Buscar {settings.homePage.type === 'page' ? 'página' : settings.homePage.type === 'post' ? 'post' : 'categoria'}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="searchContent"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Digite para buscar ${settings.homePage.type === 'page' ? 'páginas' : settings.homePage.type === 'post' ? 'posts' : 'categorias'}`}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSearch} 
                      disabled={isSearching || !searchQuery.trim()}
                      type="button"
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 font-medium text-sm">Resultados da busca</div>
                    <div className="divide-y">
                      {searchResults.map((item) => (
                        <div 
                          key={item.id} 
                          className={`px-4 py-3 flex justify-between items-center hover:bg-gray-50 cursor-pointer ${settings.homePage.id === item.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleSelectHomePageItem(item)}
                        >
                          <div>
                            <div className="font-medium">{item.title}</div>
                            <div className="text-sm text-gray-500">/{item.slug}</div>
                          </div>
                          {settings.homePage.id === item.id && (
                            <div className="text-sm font-medium text-green-600">Selecionado</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {settings.homePage.id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="font-medium">Página inicial atual:</div>
                    <div className="text-sm">{settings.homePage.title}</div>
                    <div className="text-xs text-gray-500 mt-1">/{settings.homePage.slug}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>
              Configure as informações básicas do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Blog</Label>
              <Input 
                id="name"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                placeholder="Nome do seu blog"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description"
                name="description"
                value={settings.description}
                onChange={handleInputChange}
                placeholder="Uma breve descrição do seu blog"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
            <CardDescription>
              Configure os dados de contato exibidos no site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email de Contato</Label>
              <Input 
                id="contactEmail"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleInputChange}
                placeholder="contato@seusite.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone de Contato</Label>
              <InputMask 
                mask="(99) 9999-9999"
                id="contactPhone"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="(00) 0000-0000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactWhatsapp">WhatsApp</Label>
              <InputMask 
                mask="(99) 99999-9999"
                id="contactWhatsapp"
                name="contactWhatsapp"
                value={settings.contactWhatsapp}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="(00) 00000-0000"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card id="whatsapp">
          <CardHeader>
            <CardTitle>Botão Flutuante de WhatsApp</CardTitle>
            <CardDescription>
              Configure o botão de WhatsApp que aparecerá no canto inferior direito do site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="whatsappEnabled"
                checked={settings.whatsappConfig.enabled}
                onChange={toggleWhatsappEnabled}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="whatsappEnabled">Ativar botão flutuante de WhatsApp</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappNumber">Número do WhatsApp (com DDD)</Label>
              <Input
                id="whatsappNumber"
                name="whatsappConfig.number"
                value={settings.whatsappConfig.number}
                onChange={handleWhatsappConfigChange}
                placeholder="11999999999"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground mt-1">Digite apenas números, incluindo o código do país (55) e DDD</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappMessage">Texto predefinido para envio</Label>
              <textarea
                id="whatsappMessage"
                name="whatsappConfig.message"
                value={settings.whatsappConfig.message}
                onChange={handleWhatsappConfigChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Olá! Vim pelo site e gostaria de algumas informações."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsappHoverText">Texto ao passar o mouse</Label>
              <Input
                id="whatsappHoverText"
                name="whatsappConfig.hoverText"
                value={settings.whatsappConfig.hoverText}
                onChange={handleWhatsappConfigChange}
                placeholder="Precisa de ajuda? Fale conosco!"
              />
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h4 className="font-medium mb-2">Prévia do link:</h4>
              <p className="text-xs break-all">
                https://api.whatsapp.com/send?phone=55{settings.whatsappConfig.number}&text={encodeURIComponent(settings.whatsappConfig.message)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>
              Configure as informações de endereço do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Rua/Avenida</Label>
              <Input 
                id="street"
                name="address.street"
                value={settings.address.street}
                onChange={handleAddressChange}
                placeholder="Av. Tecnologia"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input 
                id="number"
                name="address.number"
                value={settings.address.number}
                onChange={handleAddressChange}
                placeholder="1000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city"
                name="address.city"
                value={settings.address.city}
                onChange={handleAddressChange}
                placeholder="São Paulo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input 
                id="state"
                name="address.state"
                value={settings.address.state}
                onChange={handleAddressChange}
                placeholder="SP"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input 
                id="country"
                name="address.country"
                value={settings.address.country}
                onChange={handleAddressChange}
                placeholder="Brasil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <InputMask 
                mask="99999-999"
                id="zipCode"
                name="address.zipCode"
                value={settings.address.zipCode}
                onChange={handleAddressChange}
                placeholder="00000-000"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
            <CardDescription>
              Configure os links para suas redes sociais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input 
                id="facebook"
                name="socialMedia.facebook"
                value={settings.socialMedia.facebook}
                onChange={handleSocialMediaChange}
                placeholder="https://facebook.com/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input 
                id="instagram"
                name="socialMedia.instagram"
                value={settings.socialMedia.instagram}
                onChange={handleSocialMediaChange}
                placeholder="https://instagram.com/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input 
                id="twitter"
                name="socialMedia.twitter"
                value={settings.socialMedia.twitter}
                onChange={handleSocialMediaChange}
                placeholder="https://twitter.com/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input 
                id="linkedin"
                name="socialMedia.linkedin"
                value={settings.socialMedia.linkedin}
                onChange={handleSocialMediaChange}
                placeholder="https://linkedin.com/in/seuperfil"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input 
                id="youtube"
                name="socialMedia.youtube"
                value={settings.socialMedia.youtube}
                onChange={handleSocialMediaChange}
                placeholder="https://youtube.com/c/seucanal"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo do Blog</CardTitle>
            <CardDescription>
              Faça upload da logo do seu blog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {settings.logo && (
                <div className="relative w-48 h-48 border rounded-md overflow-hidden">
                  <Image
                    src={settings.logo}
                    alt="Logo do blog"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              
              <Button 
                variant="outline" 
                onClick={triggerFileInput}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    {settings.logo ? 'Alterar Logo' : 'Fazer Upload da Logo'}
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-500">
                Formatos aceitos: JPG, PNG, SVG, WEBP, GIF. Tamanho máximo: 2MB.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={saveSettings} 
          disabled={isSaving}
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
  );
}
