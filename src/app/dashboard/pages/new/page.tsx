'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Wand2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionEditor } from '@/components/section-editor';

interface PageData {
  title: string;
  slug: string;
  description: string;
  sections: any[];
  metaTags: {
    keywords: string;
    description: string;
  };
  isAIGenerated: boolean;
}

interface AIOptions {
  model: string;
  maxTokens: number;
  featuresCount: number;
  testimonialsCount: number;
  ctaLink: string;
  temperature: number;
}

export default function NewPagePage() {
  const router = useRouter();
  const [pageData, setPageData] = useState<PageData>({
    title: '',
    slug: '',
    description: '',
    sections: [],
    metaTags: {
      keywords: '',
      description: ''
    },
    isAIGenerated: false
  });
  
  const [activeTab, setActiveTab] = useState('manual');
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiOptions, setAiOptions] = useState<AIOptions>({
    model: 'gpt-3.5-turbo',
    maxTokens: 2500,
    featuresCount: 3,
    testimonialsCount: 2,
    ctaLink: '#contato',
    temperature: 0.7
  });
  const [estimatedCost, setEstimatedCost] = useState<string>('0.00');
  const [promptExamples] = useState([
    'Crie uma página sobre serviços de consultoria empresarial com seções para diferentes tipos de serviços, benefícios e depoimentos de clientes.',
    'Crie uma página "Sobre Nós" para uma empresa de tecnologia, incluindo história da empresa, valores, equipe e missão.',
    'Crie uma página de contato com formulário, informações de endereço, mapa e horário de funcionamento.'
  ]);

  // Atualizar slug automaticamente com base no título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setPageData({
      ...pageData,
      title,
      slug: title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-')
    });
  };

  // Calcular estimativa de custo com base no modelo e tokens
  const calculateCost = (model: string, tokens: number): string => {
    // Preços aproximados por 1000 tokens (entrada + saída combinados)
    const prices: Record<string, number> = {
      'gpt-3.5-turbo': 0.002,     // $0.002 por 1K tokens
      'gpt-4': 0.06,              // $0.06 por 1K tokens
      'gpt-4-turbo': 0.03,        // $0.03 por 1K tokens
      'gpt-4o-mini': 0.015        // $0.015 por 1K tokens
    };
    
    const pricePerToken = prices[model] || prices['gpt-3.5-turbo'];
    const estimatedCost = (tokens / 1000) * pricePerToken;
    
    return estimatedCost.toFixed(4);
  };
  
  // Atualizar estimativa de custo quando as opções mudam
  const updateCostEstimate = () => {
    const cost = calculateCost(aiOptions.model, aiOptions.maxTokens);
    setEstimatedCost(cost);
  };
  
  // Atualizar opções de IA
  const handleAIOptionChange = (option: keyof AIOptions, value: any) => {
    const newOptions = { ...aiOptions, [option]: value };
    setAiOptions(newOptions);
    
    // Atualizar estimativa de custo se o modelo ou tokens mudarem
    if (option === 'model' || option === 'maxTokens') {
      const cost = calculateCost(newOptions.model, newOptions.maxTokens);
      setEstimatedCost(cost);
    }
  };

  // Gerar conteúdo com IA
  const handleGenerateContent = async () => {
    if (!pageData.title) {
      toast.error('Adicione um título para a página');
      return;
    }

    if (!aiPrompt) {
      toast.error('Adicione um prompt para a IA');
      return;
    }

    try {
      setGeneratingContent(true);
      
      const response = await fetch('/api/pages/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: pageData.title,
          prompt: aiPrompt,
          options: aiOptions
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setPageData({
          ...pageData,
          sections: data.sections || [],
          metaTags: {
            keywords: data.metaTags?.keywords || '',
            description: data.metaTags?.description || ''
          },
          description: data.metaTags?.description || '',
          isAIGenerated: true
        });
        
        toast.success('Conteúdo gerado com sucesso');
        setActiveTab('preview');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao gerar conteúdo');
      }
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      toast.error('Erro ao gerar conteúdo com IA');
    } finally {
      setGeneratingContent(false);
    }
  };

  // Salvar página
  const handleSavePage = async () => {
    if (!pageData.title) {
      toast.error('Adicione um título para a página');
      return;
    }

    if (!pageData.slug) {
      toast.error('Adicione um slug (URL) para a página');
      return;
    }

    try {
      setSaving(true);
      
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      });
      
      if (response.ok) {
        const data = await response.json();
        toast.success('Página criada com sucesso');
        router.push(`/dashboard/pages/${data._id}`);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erro ao criar página');
      }
    } catch (error) {
      console.error('Erro ao criar página:', error);
      toast.error('Erro ao criar página');
    } finally {
      setSaving(false);
    }
  };

  // Usar exemplo de prompt
  const usePromptExample = (example: string) => {
    setAiPrompt(example);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/pages">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Nova Página</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Coluna da esquerda - Informações básicas */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título da Página</Label>
              <Input
                id="title"
                value={pageData.title}
                onChange={handleTitleChange}
                placeholder="Ex: Sobre Nós"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">
                Slug (URL)
                <span className="text-xs text-muted-foreground ml-1">
                  /{pageData.slug}
                </span>
              </Label>
              <Input
                id="slug"
                value={pageData.slug}
                onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
                placeholder="ex: sobre-nos"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (Meta)</Label>
              <Textarea
                id="description"
                value={pageData.description}
                onChange={(e) => setPageData({ ...pageData, description: e.target.value })}
                placeholder="Breve descrição da página para SEO"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="keywords">Palavras-chave (Meta)</Label>
              <Input
                id="keywords"
                value={pageData.metaTags.keywords}
                onChange={(e) => setPageData({ 
                  ...pageData, 
                  metaTags: { ...pageData.metaTags, keywords: e.target.value } 
                })}
                placeholder="palavra1, palavra2, palavra3"
              />
              <p className="text-xs text-muted-foreground">
                Separe as palavras-chave por vírgulas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Coluna da direita - Conteúdo */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Conteúdo da Página</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="manual">Criar Manualmente</TabsTrigger>
                <TabsTrigger value="ai">Gerar com IA</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Após criar a página, você poderá adicionar seções de conteúdo como cabeçalho, 
                  recursos, depoimentos, chamadas para ação, etc.
                </p>
                
                <div className="flex justify-end">
                  <Button onClick={handleSavePage} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Criar Página'
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="ai" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="aiPrompt">Prompt para IA</Label>
                  <Textarea
                    id="aiPrompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Descreva o conteúdo que você deseja para esta página..."
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Exemplos de prompts:</Label>
                  <div className="grid gap-2">
                    {promptExamples.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-2 px-3 text-left"
                        onClick={() => usePromptExample(example)}
                      >
                        <span className="truncate">{example}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className="text-sm"
                    >
                      {showAdvancedOptions ? 'Ocultar opções avançadas' : 'Mostrar opções avançadas'}
                    </Button>
                    
                    <div className="text-sm text-muted-foreground">
                      Custo estimado: <span className="font-medium">${estimatedCost}</span>
                    </div>
                  </div>
                  
                  {showAdvancedOptions && (
                    <div className="border rounded-md p-4 space-y-4 bg-muted/30">
                      <h3 className="font-medium">Opções Avançadas</h3>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="ai-model">Modelo de IA</Label>
                          <select
                            id="ai-model"
                            className="w-full p-2 border rounded-md"
                            value={aiOptions.model}
                            onChange={(e) => handleAIOptionChange('model', e.target.value)}
                          >
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido e econômico)</option>
                            <option value="gpt-4o-mini">GPT-4o-mini (Bom custo-benefício)</option>
                            <option value="gpt-4-turbo">GPT-4 Turbo (Equilibrado)</option>
                            <option value="gpt-4">GPT-4 (Alta qualidade)</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="max-tokens">
                            Tokens máximos: {aiOptions.maxTokens}
                            <span className="text-xs text-muted-foreground ml-2">
                              (~{Math.round(aiOptions.maxTokens * 0.75)} palavras)
                            </span>
                          </Label>
                          <input
                            id="max-tokens"
                            type="range"
                            min="500"
                            max="4000"
                            step="100"
                            value={aiOptions.maxTokens}
                            onChange={(e) => handleAIOptionChange('maxTokens', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="features-count">Número de recursos/features</Label>
                          <input
                            id="features-count"
                            type="number"
                            min="1"
                            max="10"
                            value={aiOptions.featuresCount}
                            onChange={(e) => handleAIOptionChange('featuresCount', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="testimonials-count">Número de depoimentos</Label>
                          <input
                            id="testimonials-count"
                            type="number"
                            min="0"
                            max="5"
                            value={aiOptions.testimonialsCount}
                            onChange={(e) => handleAIOptionChange('testimonialsCount', parseInt(e.target.value))}
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cta-link">Link do botão CTA</Label>
                          <Input
                            id="cta-link"
                            value={aiOptions.ctaLink}
                            onChange={(e) => handleAIOptionChange('ctaLink', e.target.value)}
                            placeholder="Ex: #contato ou /contato"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="temperature">
                            Criatividade: {aiOptions.temperature.toFixed(1)}
                          </Label>
                          <input
                            id="temperature"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={aiOptions.temperature}
                            onChange={(e) => handleAIOptionChange('temperature', parseFloat(e.target.value))}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Preciso</span>
                            <span>Criativo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 mt-4">
                  <Button 
                    onClick={handleGenerateContent} 
                    disabled={generatingContent}
                    className="gap-2"
                  >
                    {generatingContent ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Gerando...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Gerar Conteúdo
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4">
                {pageData.sections.length > 0 ? (
                  <>
                    <SectionEditor 
                      sections={pageData.sections} 
                      onChange={(updatedSections) => {
                        setPageData(prev => ({
                          ...prev,
                          sections: updatedSections
                        }));
                      }} 
                    />
                    
                    <div className="flex justify-end mt-6">
                      <Button onClick={handleSavePage} disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          'Criar Página com Conteúdo Gerado'
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p>Nenhum conteúdo gerado ainda. Volte para a aba "Gerar com IA".</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
