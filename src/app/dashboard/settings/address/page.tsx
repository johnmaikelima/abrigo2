'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AddressSettingsPage() {
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
          section: 'address',
          settings: settings.address || {}
        }),
      });
      
      if (!response.ok) throw new Error('Falha ao salvar configurações');
      
      toast({
        title: 'Sucesso',
        description: 'Endereço atualizado com sucesso',
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
        <h1 className="text-3xl font-bold tracking-tight">Configurações de Endereço</h1>
        <p className="text-muted-foreground mt-2">
          Configure o endereço que será exibido no rodapé e na página de contato.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>
            Estas informações serão exibidas no rodapé do site e na página de contato.
            Preencha apenas os campos que deseja exibir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="street">Rua/Avenida</Label>
              <Input
                id="street"
                placeholder="Av. Paulista"
                value={settings?.address?.street || ''}
                onChange={(e) => handleChange('address.street', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                placeholder="1000"
                value={settings?.address?.number || ''}
                onChange={(e) => handleChange('address.number', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Sala 123"
                value={settings?.address?.complement || ''}
                onChange={(e) => handleChange('address.complement', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                placeholder="Centro"
                value={settings?.address?.neighborhood || ''}
                onChange={(e) => handleChange('address.neighborhood', e.target.value)}
              />
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="São Paulo"
                value={settings?.address?.city || ''}
                onChange={(e) => handleChange('address.city', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                placeholder="SP"
                value={settings?.address?.state || ''}
                onChange={(e) => handleChange('address.state', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP</Label>
              <Input
                id="zipCode"
                placeholder="01310-100"
                value={settings?.address?.zipCode || ''}
                onChange={(e) => handleChange('address.zipCode', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">País</Label>
              <Input
                id="country"
                placeholder="Brasil"
                value={settings?.address?.country || ''}
                onChange={(e) => handleChange('address.country', e.target.value)}
              />
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
                Salvar Endereço
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Dica</h3>
            <div className="mt-1 text-sm text-blue-700">
              <p>O endereço será exibido no rodapé do site e na página de contato.</p>
              <p className="mt-2">Se você não deseja exibir alguma informação específica, basta deixar o campo em branco.</p>
              <p className="mt-2">O endereço completo também será usado para gerar um link para o Google Maps.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
