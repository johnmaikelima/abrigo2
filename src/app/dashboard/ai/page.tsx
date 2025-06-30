'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, FileText, Type, FileQuestion, BookOpen, Wand2, KeyRound, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function AiDashboard() {
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [outline, setOutline] = useState('');
  const [result, setResult] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  
  // Estados para artigos em massa
  const [keywords, setKeywords] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [charCount, setCharCount] = useState('3000');
  const [customPrompt, setCustomPrompt] = useState('Linguagem simples e natural, como se fosse uma conversa com o leitor.\n\nCrie um índice no início do artigo com links âncora para cada seção. Use a tag <nav class="toc"> para envolver o índice e lista <ul> com links <a href="#secao-1">Título da Seção</a>.\n\nEstrutura bem organizada com subtítulos usando heading tags (h2 e h3). Cada subtítulo deve ter um id correspondente ao link no índice, por exemplo: <h2 id="secao-1">Título da Seção</h2>.\n\nPalavra-chave principal: {palavra-chave}\n\nUso de variações semânticas e termos relacionados à palavra-chave.\n\nAbertura com uma pergunta ou situação comum do dia a dia, que envolva o leitor.\n\nExplicações claras e conteúdo útil, com exemplos práticos sempre que possível.\n\nInclusão de benefícios, problemas resolvidos e/ou erros comuns relacionados ao tema.\n\nFinal com uma chamada para ação (CTA) encorajando o leitor a agir (comprar, clicar, entrar em contato, etc).\n\nSugira uma meta descrição de até 160 caracteres otimizada para SEO.\n\nCrie um título chamativo e atrativo que contenha a palavra-chave.');
  const [saveToDatabase, setSaveToDatabase] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedPostId, setSavedPostId] = useState('');

  // Carregar categorias ao iniciar o componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData.map((cat: any) => ({
            id: cat.id,
            name: cat.name
          })));
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Função para lidar com a seleção de thumbnail
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WEBP.');
      return;
    }
    
    // Validar tamanho (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 2MB.');
      return;
    }
    
    setThumbnailFile(file);
    
    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Função para fazer upload da thumbnail
  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return '';
    
    const formData = new FormData();
    formData.append('file', thumbnailFile);
    formData.append('type', 'post'); // Indicar que é uma imagem de post
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Falha ao fazer upload da imagem');
      }
      
      const data = await response.json();
      return data.fileUrl; // A API retorna fileUrl, não url
    } catch (error) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  // Função para gerar conteúdo com base na ação selecionada
  const generateAiContent = async (action: string) => {
    if (loading) return;

    // Validar entradas com base na ação
    if ((action === 'generate-content' && !prompt) || 
        ((action === 'generate-title' || action === 'generate-description' || action === 'generate-outline' || action === 'generate-article') && !topic) ||
        (action === 'improve-content' && !content) ||
        (action === 'generate-bulk-article' && !keywords)) {
      toast.error('Por favor, preencha todos os campos necessários.');
      return;
    }

    setLoading(true);
    setResult('');
    setSavedPostId('');

    try {
      let coverImageUrl = '';
      
      // Se for artigo em massa e tiver thumbnail, fazer upload primeiro
      if (action === 'generate-bulk-article' && thumbnailFile && saveToDatabase) {
        try {
          coverImageUrl = await uploadThumbnail();
        } catch (uploadError) {
          toast.error('Erro ao fazer upload da imagem. Continuando sem thumbnail.');
        }
      }
      
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          prompt,
          topic,
          content,
          outline,
          // Campos para artigo em massa
          keywords,
          category: selectedCategory,
          charCount: parseInt(charCount),
          customPrompt,
          saveToDatabase,
          coverImage: coverImageUrl
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao gerar conteúdo');
      }

      const data = await response.json();
      
      // Tratar resposta específica para artigo em massa
      if (action === 'generate-bulk-article') {
        if (data.saved) {
          setSavedPostId(data.postId);
          toast.success(`Artigo criado e salvo com sucesso! ID: ${data.postId}`);
        }
        
        try {
          const parsedResult = JSON.parse(data.result);
          setResult(JSON.stringify(parsedResult, null, 2));
        } catch {
          setResult(data.result);
        }
      } else {
        setResult(data.result);
      }
      
      toast.success('Conteúdo gerado com sucesso!');
    } catch (error: any) {
      console.error('Erro:', error);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Função para copiar o resultado para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success('Copiado para a área de transferência!');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assistente de IA</h1>
        <p className="text-gray-600">
          Use a inteligência artificial para gerar conteúdo para o seu blog.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Conteúdo Livre</span>
          </TabsTrigger>
          <TabsTrigger value="title" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span className="hidden sm:inline">Título</span>
          </TabsTrigger>
          <TabsTrigger value="description" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Descrição</span>
          </TabsTrigger>
          <TabsTrigger value="outline" className="flex items-center gap-2">
            <FileQuestion className="h-4 w-4" />
            <span className="hidden sm:inline">Esboço</span>
          </TabsTrigger>
          <TabsTrigger value="article" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Artigo</span>
          </TabsTrigger>
          <TabsTrigger value="improve" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">Melhorar</span>
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <KeyRound className="h-4 w-4" />
            <span className="hidden sm:inline">Artigo em Massa</span>
          </TabsTrigger>
        </TabsList>

        {/* Conteúdo Livre */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Conteúdo Livre</CardTitle>
              <CardDescription>
                Forneça um prompt detalhado para gerar conteúdo personalizado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Ex: Escreva um parágrafo sobre os benefícios da meditação para a saúde mental."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setPrompt('')}>Limpar</Button>
              <Button 
                onClick={() => generateAiContent('generate-content')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Conteúdo
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Título */}
        <TabsContent value="title">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Título Otimizado para SEO</CardTitle>
              <CardDescription>
                Crie títulos atraentes e otimizados para SEO com base no tópico do seu artigo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="topic-title">Tópico do Artigo</Label>
                  <Input
                    id="topic-title"
                    placeholder="Ex: Benefícios da meditação para a saúde mental"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setTopic('')}>Limpar</Button>
              <Button 
                onClick={() => generateAiContent('generate-title')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Type className="mr-2 h-4 w-4" />
                    Gerar Título
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Descrição */}
        <TabsContent value="description">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Meta Descrição</CardTitle>
              <CardDescription>
                Crie meta descrições otimizadas para SEO com 150-160 caracteres.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="topic-desc">Tópico do Artigo</Label>
                  <Input
                    id="topic-desc"
                    placeholder="Ex: Benefícios da meditação para a saúde mental"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setTopic('')}>Limpar</Button>
              <Button 
                onClick={() => generateAiContent('generate-description')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Gerar Descrição
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Esboço */}
        <TabsContent value="outline">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Esboço de Artigo</CardTitle>
              <CardDescription>
                Crie um esboço detalhado para seu artigo com introdução, seções principais e conclusão.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="topic-outline">Tópico do Artigo</Label>
                  <Input
                    id="topic-outline"
                    placeholder="Ex: Benefícios da meditação para a saúde mental"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setTopic('')}>Limpar</Button>
              <Button 
                onClick={() => generateAiContent('generate-outline')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Gerar Esboço
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Artigo */}
        <TabsContent value="article">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Artigo Completo</CardTitle>
              <CardDescription>
                Crie um artigo completo com base em um tópico e, opcionalmente, um esboço.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="topic-article">Tópico do Artigo</Label>
                  <Input
                    id="topic-article"
                    placeholder="Ex: Benefícios da meditação para a saúde mental"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="outline-article">Esboço (opcional)</Label>
                  <Textarea
                    id="outline-article"
                    placeholder="Cole aqui um esboço gerado anteriormente ou deixe em branco para gerar automaticamente"
                    value={outline}
                    onChange={(e) => setOutline(e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => { setTopic(''); setOutline(''); }}>Limpar</Button>
              <Button 
                onClick={() => generateAiContent('generate-article')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Gerar Artigo
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Melhorar */}
        <TabsContent value="improve">
          <Card>
            <CardHeader>
              <CardTitle>Melhorar Conteúdo Existente</CardTitle>
              <CardDescription>
                Otimize seu conteúdo existente para SEO, legibilidade e engajamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="content-improve">Conteúdo a ser melhorado</Label>
                  <Textarea
                    id="content-improve"
                    placeholder="Cole aqui o conteúdo que deseja melhorar..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setContent('')}>Limpar</Button>
              <Button 
                onClick={() => generateAiContent('improve-content')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Melhorando...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Melhorar Conteúdo
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Artigo em Massa */}
        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Artigo em Massa</CardTitle>
              <CardDescription>
                Crie artigos completos a partir de palavras-chave. Os artigos serão otimizados para SEO e salvos automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">Palavras-chave (uma por linha)</Label>
                <Textarea
                  id="keywords"
                  placeholder="Digite uma ou mais palavras-chave, uma por linha..."
                  className="min-h-[100px]"
                  value={keywords}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeywords(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Se a categoria não existir, ela será criada automaticamente.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (opcional)</Label>
                <div className="flex items-center gap-4">
                  <label htmlFor="thumbnail-upload" className="cursor-pointer">
                    <div className="border border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Clique para fazer upload</span>
                      <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF ou WEBP (max 2MB)</span>
                    </div>
                    <input
                      type="file"
                      id="thumbnail-upload"
                      className="hidden"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleFileChange}
                    />
                  </label>
                  
                  {thumbnailPreview && (
                    <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full h-full object-cover" 
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-5 h-5 flex items-center justify-center text-xs"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          setThumbnailFile(null);
                          setThumbnailPreview('');
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="char-count">Quantidade de caracteres</Label>
                <Input
                  id="char-count"
                  type="number"
                  min="1000"
                  max="10000"
                  step="500"
                  value={charCount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCharCount(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Recomendado: 3000 a 5000 caracteres</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-prompt">Prompt personalizado</Label>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="save-db" className="text-sm">Salvar no banco</Label>
                    <Switch
                      id="save-db"
                      checked={saveToDatabase}
                      onCheckedChange={setSaveToDatabase}
                    />
                  </div>
                </div>
                <Textarea
                  id="custom-prompt"
                  placeholder="Instruções para a IA sobre como escrever o artigo..."
                  className="min-h-[150px]"
                  value={customPrompt}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCustomPrompt(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Use {'{palavra-chave}'}, {'{keyword}'} ou {'{keywords}'} para referenciar automaticamente a palavra-chave principal no prompt.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => generateAiContent('generate-bulk-article')} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando artigo...
                  </>
                ) : (
                  'Gerar Artigo em Massa'
                )}
              </Button>
            </CardFooter>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Artigo Gerado</CardTitle>
                {savedPostId && (
                  <CardDescription>
                    Artigo salvo com sucesso! ID: {savedPostId}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto ml-2"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        window.open(`/dashboard/posts/edit/${savedPostId}`, '_blank');
                      }}
                    >
                      Editar post
                    </Button>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{result}</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
