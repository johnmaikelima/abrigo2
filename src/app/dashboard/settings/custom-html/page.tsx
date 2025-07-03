'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Code, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  head: z.string().optional(),
  body: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomHtmlSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('head');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      head: '',
      body: '',
    },
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/blog');
        const data = await response.json();
        
        if (data.success && data.settings) {
          form.reset({
            head: data.settings.customHtml?.head || '',
            body: data.settings.customHtml?.body || '',
          });
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast.error('Erro ao carregar as configurações de HTML personalizado');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);
      
      const response = await fetch('/api/settings/blog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'customHtml',
          settings: data,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Configurações de HTML personalizado salvas com sucesso!');
      } else {
        throw new Error(result.error || 'Erro ao salvar as configurações');
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar as configurações');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">HTML Personalizado</h1>
        <p className="text-muted-foreground">
          Adicione códigos HTML personalizados ao cabeçalho e rodapé do seu site
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="head">Cabeçalho (head)</TabsTrigger>
              <TabsTrigger value="body">Rodapé (body)</TabsTrigger>
            </TabsList>

            <TabsContent value="head" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Código HTML para o &lt;head&gt;</CardTitle>
                  <CardDescription>
                    Adicione códigos como meta tags, scripts de análise, pixels de rastreamento, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="head"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código HTML</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="font-mono text-sm h-64"
                            placeholder={`<!-- Exemplo: Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=SEU_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'SEU_ID');
</script>`}
                          />
                        </FormControl>
                        <FormDescription>
                          Este código será inserido antes do fechamento da tag &lt;/head&gt;.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="body" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Código HTML para o &lt;body&gt;</CardTitle>
                  <CardDescription>
                    Adicione códigos como widgets de chat, popups, ou scripts que devem ser carregados no final da página.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código HTML</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="font-mono text-sm h-64"
                            placeholder={`<!-- Exemplo: Widget de chat -->
<div id="chat-widget">
  <!-- Código do widget de chat -->
</div>
<script>
  // Inicialização do widget
  document.addEventListener('DOMContentLoaded', function() {
    // Código de inicialização
  });
</script>`}
                          />
                        </FormControl>
                        <FormDescription>
                          Este código será inserido antes do fechamento da tag &lt;/body&gt;.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Alert>
            <Code className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription className="mt-2">
              Tenha cuidado ao adicionar códigos HTML personalizados. Códigos maliciosos ou com erros podem afetar o funcionamento do seu site.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Save className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
