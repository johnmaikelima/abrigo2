'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SliderImage {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  _id?: string;
}

interface Slider {
  _id: string;
  name: string;
  description?: string;
  width: string;
  height: string;
  interval: number;
  images: SliderImage[];
  createdAt: string;
  updatedAt: string;
}

export default function SliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [newSlider, setNewSlider] = useState({
    name: '',
    description: '',
    width: '100%',
    height: '400px',
    interval: 5000,
  });

  // Buscar sliders
  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sliders');
      
      if (response.ok) {
        const data = await response.json();
        setSliders(data);
      } else {
        toast.error('Erro ao carregar sliders');
      }
    } catch (error) {
      console.error('Erro ao buscar sliders:', error);
      toast.error('Erro ao carregar sliders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  // Criar novo slider
  const handleCreateSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/sliders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newSlider,
          images: [],
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setSliders([data, ...sliders]);
        setIsCreateDialogOpen(false);
        setNewSlider({
          name: '',
          description: '',
          width: '100%',
          height: '400px',
          interval: 5000,
        });
        toast.success('Slider criado com sucesso');
      } else {
        toast.error('Erro ao criar slider');
      }
    } catch (error) {
      console.error('Erro ao criar slider:', error);
      toast.error('Erro ao criar slider');
    }
  };

  // Excluir slider
  const handleDeleteSlider = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este slider?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSliders(sliders.filter(slider => slider._id !== id));
        toast.success('Slider excluído com sucesso');
      } else {
        toast.error('Erro ao excluir slider');
      }
    } catch (error) {
      console.error('Erro ao excluir slider:', error);
      toast.error('Erro ao excluir slider');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sliders</h1>
          <p className="text-muted-foreground mt-2">
            Crie e gerencie banners e sliders para seu site.
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo Slider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreateSlider}>
              <DialogHeader>
                <DialogTitle>Criar Novo Slider</DialogTitle>
                <DialogDescription>
                  Preencha as informações básicas do slider. Você poderá adicionar imagens depois.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nome do Slider</Label>
                  <Input
                    id="name"
                    value={newSlider.name}
                    onChange={(e) => setNewSlider({ ...newSlider, name: e.target.value })}
                    placeholder="Ex: Banner Principal"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={newSlider.description}
                    onChange={(e) => setNewSlider({ ...newSlider, description: e.target.value })}
                    placeholder="Descreva o propósito deste slider"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="width">Largura</Label>
                    <Input
                      id="width"
                      value={newSlider.width}
                      onChange={(e) => setNewSlider({ ...newSlider, width: e.target.value })}
                      placeholder="Ex: 100% ou 1200px"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="height">Altura</Label>
                    <Input
                      id="height"
                      value={newSlider.height}
                      onChange={(e) => setNewSlider({ ...newSlider, height: e.target.value })}
                      placeholder="Ex: 400px"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="interval">Intervalo entre slides (ms)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1000"
                    step="500"
                    value={newSlider.interval}
                    onChange={(e) => setNewSlider({ ...newSlider, interval: parseInt(e.target.value) })}
                    placeholder="Ex: 5000 (5 segundos)"
                    required
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Slider</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Card de Tutorial */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Como usar os Sliders</CardTitle>
          <CardDescription>
            Guia rápido para implementar sliders em seu site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. Crie e configure seu slider</h3>
            <p className="text-sm text-muted-foreground">
              Crie um slider, defina suas dimensões e intervalo de transição, e adicione imagens com textos e botões.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">2. Implemente em suas páginas</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use o componente SliderContainer em qualquer página do seu site:
            </p>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-xs">{`<SliderContainer sliderId="id-do-seu-slider" />`}</code>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">3. Importe o componente</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Adicione esta importação no topo do seu arquivo:
            </p>
            <div className="bg-muted p-3 rounded-md">
              <code className="text-xs">{`import SliderContainer from '@/components/slider-container';`}</code>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/slider-demo" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" /> Ver Demonstração
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/banner-exemplo" target="_blank">
              <ExternalLink className="h-4 w-4 mr-2" /> Ver Exemplo de Banner
            </Link>
          </Button>
        </CardFooter>
      </Card>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : sliders.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <ExternalLink className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Nenhum slider encontrado</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Crie seu primeiro slider para exibir banners e imagens em destaque no seu site.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Criar Slider
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sliders.map((slider) => (
            <Card key={slider._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{slider.name}</CardTitle>
                {slider.description && (
                  <CardDescription className="line-clamp-2">
                    {slider.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimensões:</span>
                    <span>{slider.width} × {slider.height}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Intervalo:</span>
                    <span>{slider.interval / 1000}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Imagens:</span>
                    <span>{slider.images.length}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSlider(slider._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Excluir
                </Button>
                <Link href={`/dashboard/settings/slider/${slider._id}`}>
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
