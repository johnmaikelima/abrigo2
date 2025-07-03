'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Send, Mail } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

export default function EmailSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
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
        description: 'Configurações de email salvas com sucesso',
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
  
  // Testar configurações SMTP
  const handleTestEmail = async () => {
    setIsTesting(true);
    try {
      const response = await fetch('/api/settings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          smtp: settings.smtp,
          recipient: settings.contactEmail || settings.smtp.auth.user,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao testar email');
      }
      
      toast({
        title: 'Sucesso',
        description: 'Email de teste enviado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao testar email:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível enviar o email de teste',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
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
        <h1 className="text-3xl font-bold tracking-tight">Configurações de Email</h1>
        <p className="text-muted-foreground mt-2">
          Configure o servidor SMTP para envio de emails e o formulário de contato.
        </p>
      </div>
      
      <Tabs defaultValue="smtp" className="space-y-4">
        <TabsList>
          <TabsTrigger value="smtp">Servidor SMTP</TabsTrigger>
          <TabsTrigger value="contact">Formulário de Contato</TabsTrigger>
        </TabsList>
        
        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Servidor SMTP</CardTitle>
              <CardDescription>
                Configure o servidor SMTP para envio de emails do seu site.
                Estas informações são necessárias para o funcionamento do formulário de contato.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">Servidor SMTP</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.exemplo.com"
                    value={settings?.smtp?.host || ''}
                    onChange={(e) => handleChange('smtp.host', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Porta</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    placeholder="587"
                    value={settings?.smtp?.port || 587}
                    onChange={(e) => handleChange('smtp.port', parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smtp-secure"
                  checked={settings?.smtp?.secure || false}
                  onCheckedChange={(checked: boolean) => handleChange('smtp.secure', checked)}
                />
                <Label htmlFor="smtp-secure">Usar conexão segura (SSL/TLS)</Label>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="smtp-user">Usuário</Label>
                <Input
                  id="smtp-user"
                  placeholder="seu.email@exemplo.com"
                  value={settings?.smtp?.auth?.user || ''}
                  onChange={(e) => handleChange('smtp.auth.user', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-pass">Senha</Label>
                <Input
                  id="smtp-pass"
                  type="password"
                  placeholder="••••••••"
                  value={settings?.smtp?.auth?.pass || ''}
                  onChange={(e) => handleChange('smtp.auth.pass', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="smtp-from">Email de origem</Label>
                <Input
                  id="smtp-from"
                  placeholder="noreply@seusite.com"
                  value={settings?.smtp?.from || ''}
                  onChange={(e) => handleChange('smtp.from', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Este será o endereço de email que aparecerá como remetente dos emails enviados.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleTestEmail}
                disabled={isTesting || isSaving || !settings?.smtp?.host || !settings?.smtp?.auth?.user}
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Email de Teste
                  </>
                )}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
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
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Formulário de Contato</CardTitle>
              <CardDescription>
                Personalize o funcionamento do formulário de contato do seu site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="contact-form-enabled"
                  checked={settings?.contactForm?.enabled !== false}
                  onCheckedChange={(checked) => handleChange('contactForm.enabled', checked)}
                />
                <Label htmlFor="contact-form-enabled">Habilitar formulário de contato</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="captcha-enabled"
                  checked={settings?.contactForm?.captchaEnabled !== false}
                  onCheckedChange={(checked) => handleChange('contactForm.captchaEnabled', checked)}
                />
                <Label htmlFor="captcha-enabled">Habilitar captcha simples</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="recipient-email">Email para recebimento de mensagens</Label>
                <Input
                  id="recipient-email"
                  type="email"
                  placeholder="contato@seusite.com"
                  value={settings?.contactForm?.recipientEmail || ''}
                  onChange={(e) => handleChange('contactForm.recipientEmail', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Se não for especificado, será usado o email de contato principal.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="success-message">Mensagem de sucesso</Label>
                <Textarea
                  id="success-message"
                  placeholder="Sua mensagem foi enviada com sucesso! Entraremos em contato em breve."
                  value={settings?.contactForm?.successMessage || ''}
                  onChange={(e) => handleChange('contactForm.successMessage', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="error-message">Mensagem de erro</Label>
                <Textarea
                  id="error-message"
                  placeholder="Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente."
                  value={settings?.contactForm?.errorMessage || ''}
                  onChange={(e) => handleChange('contactForm.errorMessage', e.target.value)}
                />
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
