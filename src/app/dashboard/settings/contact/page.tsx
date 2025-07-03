'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Phone, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function ContactSettingsPage() {
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
      // Usando o novo endpoint para atualização parcial
      const response = await fetch('/api/settings/blog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'contact',
          settings: {
            contactEmail: settings.contactEmail || '',
            contactPhone: settings.contactPhone || '',
            contactWhatsapp: settings.contactWhatsapp || '',
          }
        }),
      });
      
      if (!response.ok) throw new Error('Falha ao salvar configurações');
      
      toast({
        title: 'Sucesso',
        description: 'Informações de contato atualizadas com sucesso',
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
        <h1 className="text-3xl font-bold tracking-tight">Informações de Contato</h1>
        <p className="text-muted-foreground mt-2">
          Configure os dados de contato que serão exibidos no rodapé e na página de contato.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Dados de Contato</CardTitle>
          <CardDescription>
            Estas informações serão exibidas no rodapé do site e na página de contato.
            Preencha apenas os campos que deseja exibir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email de Contato
            </Label>
            <Input
              id="contactEmail"
              type="email"
              placeholder="contato@seusite.com.br"
              value={settings?.contactEmail || ''}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Este email será exibido no rodapé e na página de contato, e também será usado como destinatário para o formulário de contato.
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="contactPhone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone de Contato
            </Label>
            <Input
              id="contactPhone"
              placeholder="(11) 9999-9999"
              value={settings?.contactPhone || ''}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Este telefone será exibido no rodapé e na página de contato.
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label htmlFor="contactWhatsapp" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              WhatsApp
            </Label>
            <Input
              id="contactWhatsapp"
              placeholder="5511999999999"
              value={settings?.contactWhatsapp || ''}
              onChange={(e) => {
                handleChange('contactWhatsapp', e.target.value);
                // Também atualiza o número de WhatsApp na configuração do botão
                if (settings?.whatsappConfig) {
                  handleChange('whatsappConfig.number', e.target.value);
                }
              }}
            />
            <p className="text-sm text-muted-foreground">
              Digite o número completo com código do país e DDD, sem espaços ou caracteres especiais.
              Exemplo: 5511999999999
            </p>
          </div>
          
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-start">
              <ExternalLink className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">Configurações relacionadas</h3>
                <div className="mt-1 text-sm text-blue-700">
                  <p>Você também pode configurar:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      <a href="/dashboard/settings/email" className="text-blue-600 hover:underline">
                        Configurações de Email e Formulário de Contato
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard/settings/whatsapp" className="text-blue-600 hover:underline">
                        Configurações do Botão de WhatsApp
                      </a>
                    </li>
                    <li>
                      <a href="/dashboard/settings/address" className="text-blue-600 hover:underline">
                        Configurações de Endereço
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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
                Salvar Informações
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
