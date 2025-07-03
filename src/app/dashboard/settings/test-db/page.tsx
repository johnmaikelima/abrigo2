'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Save, Database, RefreshCw } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function TestDbPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [rawData, setRawData] = useState<string>('');
  const { toast } = useToast();
  
  // Carregar configurações
  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/settings/blog');
      if (!response.ok) throw new Error('Falha ao carregar configurações');
      
      const data = await response.json();
      setSettings(data);
      setRawData(JSON.stringify(data, null, 2));
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
  };
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  // Testar salvamento de contato
  const testContactSave = async () => {
    setIsSaving(true);
    try {
      const testData = {
        contactEmail: 'teste@exemplo.com',
        contactPhone: '(11) 1234-5678',
        contactWhatsapp: '5511912345678'
      };
      
      const response = await fetch('/api/settings/blog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'contact',
          settings: testData
        }),
      });
      
      if (!response.ok) throw new Error('Falha ao salvar configurações');
      
      const result = await response.json();
      toast({
        title: 'Sucesso',
        description: 'Dados de teste salvos com sucesso',
      });
      
      // Recarregar dados para verificar se foram salvos
      await loadSettings();
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
  
  // Testar salvamento de endereço
  const testAddressSave = async () => {
    setIsSaving(true);
    try {
      const testData = {
        street: 'Rua de Teste',
        number: '123',
        city: 'Cidade Teste',
        state: 'ST',
        country: 'Brasil',
        zipCode: '12345-678'
      };
      
      const response = await fetch('/api/settings/blog/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section: 'address',
          settings: testData
        }),
      });
      
      if (!response.ok) throw new Error('Falha ao salvar configurações');
      
      const result = await response.json();
      toast({
        title: 'Sucesso',
        description: 'Endereço de teste salvo com sucesso',
      });
      
      // Recarregar dados para verificar se foram salvos
      await loadSettings();
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
        <h1 className="text-3xl font-bold tracking-tight">Teste de Banco de Dados</h1>
        <p className="text-muted-foreground mt-2">
          Verifique se os dados estão sendo salvos corretamente no banco de dados.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Ações de Teste</CardTitle>
            <CardDescription>
              Clique nos botões para testar o salvamento de dados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testContactSave} 
              disabled={isSaving} 
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Testar Salvar Contato
                </>
              )}
            </Button>
            
            <Button 
              onClick={testAddressSave} 
              disabled={isSaving} 
              className="w-full"
              variant="outline"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Testar Salvar Endereço
                </>
              )}
            </Button>
            
            <Separator className="my-4" />
            
            <Button 
              onClick={loadSettings} 
              disabled={isLoading} 
              className="w-full"
              variant="secondary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Recarregar Dados
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card className="w-full md:w-2/3">
          <CardHeader>
            <CardTitle>Dados Atuais</CardTitle>
            <CardDescription>
              Dados carregados diretamente do banco de dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 p-4 rounded-md overflow-auto max-h-[500px]">
              <pre className="text-xs">{rawData}</pre>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground">
              <Database className="inline-block mr-2 h-4 w-4" />
              Última atualização: {new Date().toLocaleString()}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
