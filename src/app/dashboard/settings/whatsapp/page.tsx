'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, MessageSquare } from 'lucide-react';

export default function WhatsAppSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();
  
  // Carregar configurações
  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings/blog');
        if (!response.ok) throw new Error('Falha ao carregar configurações');
        
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, [toast]);
  
  // Atualizar configurações
  const handleChange = (path: string, value: any) => {
    setSettings((prev: any) => {
      const newSettings = { ...prev };
      const parts = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]];
      }
      
      current[parts[parts.length - 1]] = value;
      return newSettings;
    });
  };
  
  // Salvar configurações
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/settings/blog', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error('Falha ao salvar configurações');
      
      toast({
        title: 'Sucesso',
        description: 'Configurações do WhatsApp salvas com sucesso',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do WhatsApp</h1>
        <p className="text-muted-foreground mt-2">
          Configure o botão flutuante de WhatsApp para seu site.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Botão de WhatsApp</CardTitle>
          <CardDescription>
            Configure o botão flutuante de WhatsApp que aparecerá no canto inferior direito do seu site.
            Este botão permite que os visitantes entrem em contato facilmente com você via WhatsApp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="whatsapp-enabled"
              checked={settings?.whatsappConfig?.enabled !== false}
              onCheckedChange={(checked: boolean) => handleChange('whatsappConfig.enabled', checked)}
            />
            <Label htmlFor="whatsapp-enabled">Habilitar botão de WhatsApp</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
            <Input
              id="whatsapp-number"
              placeholder="5511999999999"
              value={settings?.whatsappConfig?.number || settings?.contactWhatsapp || ''}
              onChange={(e) => {
                handleChange('whatsappConfig.number', e.target.value);
                // Também atualiza o número de contato principal
                handleChange('contactWhatsapp', e.target.value);
              }}
            />
            <p className="text-sm text-muted-foreground">
              Digite o número completo com código do país e DDD, sem espaços ou caracteres especiais.
              Exemplo: 5511999999999
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp-message">Mensagem predefinida</Label>
            <Textarea
              id="whatsapp-message"
              placeholder="Olá! Vim pelo site e gostaria de algumas informações."
              value={settings?.whatsappConfig?.message || ''}
              onChange={(e) => handleChange('whatsappConfig.message', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Esta mensagem será preenchida automaticamente quando o visitante clicar no botão.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="whatsapp-hover-text">Texto ao passar o mouse</Label>
            <Input
              id="whatsapp-hover-text"
              placeholder="Precisa de ajuda? Fale conosco!"
              value={settings?.whatsappConfig?.hoverText || ''}
              onChange={(e) => handleChange('whatsappConfig.hoverText', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Este texto será exibido quando o visitante passar o mouse sobre o botão.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isSaving} className="ml-auto">
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
        </CardFooter>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <MessageSquare className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Dica</h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>O botão de WhatsApp é uma ótima maneira de aumentar as conversões do seu site, facilitando o contato direto com os visitantes.</p>
              <p className="mt-2">Certifique-se de que o número está correto e que a mensagem predefinida seja clara e amigável.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
