'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2, MoveUp, MoveDown, Upload } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SliderImage {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  _id?: string;
  titleColor?: string;
  subtitleColor?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
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

export default function SliderEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [slider, setSlider] = useState<Slider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isAddImageDialogOpen, setIsAddImageDialogOpen] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<SliderImage>({
    imageUrl: '',
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    order: 0,
    titleColor: '#ffffff',
    subtitleColor: '#ffffff',
    buttonTextColor: '#ffffff',
    buttonBgColor: '#2563eb',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Buscar dados do slider
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sliders/${params.id}`);
        
        if (response.ok) {
          const data = await response.json();
          setSlider(data);
        } else {
          toast.error('Erro ao carregar slider');
          router.push('/dashboard/settings/slider');
        }
      } catch (error) {
        console.error('Erro ao buscar slider:', error);
        toast.error('Erro ao carregar slider');
        router.push('/dashboard/settings/slider');
      } finally {
        setLoading(false);
      }
    };

    fetchSlider();
  }, [params.id, router]);

  // Atualizar slider
  const handleUpdateSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slider) return;
    
    try {
      setSaving(true);
      
      const response = await fetch(`/api/sliders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slider),
      });
      
      if (response.ok) {
        toast.success('Slider atualizado com sucesso');
      } else {
        toast.error('Erro ao atualizar slider');
      }
    } catch (error) {
      console.error('Erro ao atualizar slider:', error);
      toast.error('Erro ao atualizar slider');
    } finally {
      setSaving(false);
    }
  };

  // Fazer upload de imagem
  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error('Selecione uma imagem para upload');
      return;
    }
    
    try {
      setUploadingImage(true);
      
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        setNewImage({ ...newImage, imageUrl: data.url });
        toast.success('Imagem enviada com sucesso');
      } else {
        toast.error('Erro ao enviar imagem');
      }
    } catch (error) {
      console.error('Erro ao fazer upload de imagem:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  // Adicionar nova imagem ao slider
  const handleAddImage = () => {
    if (!slider) return;
    
    if (!newImage.imageUrl) {
      toast.error('URL da imagem é obrigatória');
      return;
    }
    
    const updatedImages = [...slider.images];
    
    // Definir a ordem como a última + 1, ou 0 se for a primeira imagem
    const newOrder = updatedImages.length > 0 
      ? Math.max(...updatedImages.map(img => img.order)) + 1 
      : 0;
    
    updatedImages.push({
      ...newImage,
      order: newOrder,
    });
    
    setSlider({
      ...slider,
      images: updatedImages,
    });
    
    setNewImage({
      imageUrl: '',
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      order: 0,
    });
    
    setImageFile(null);
    setIsAddImageDialogOpen(false);
    
    toast.success('Imagem adicionada ao slider');
  };

  // Remover imagem do slider
  const handleRemoveImage = (index: number) => {
    if (!slider) return;
    
    const updatedImages = [...slider.images];
    updatedImages.splice(index, 1);
    
    // Reordenar as imagens
    updatedImages.forEach((img, i) => {
      img.order = i;
    });
    
    setSlider({
      ...slider,
      images: updatedImages,
    });
    
    toast.success('Imagem removida do slider');
  };

  // Mover imagem para cima (diminuir ordem)
  const handleMoveUp = (index: number) => {
    if (!slider || index === 0) return;
    
    const updatedImages = [...slider.images];
    
    // Trocar a ordem das imagens
    const temp = updatedImages[index].order;
    updatedImages[index].order = updatedImages[index - 1].order;
    updatedImages[index - 1].order = temp;
    
    // Reordenar o array com base na nova ordem
    updatedImages.sort((a, b) => a.order - b.order);
    
    setSlider({
      ...slider,
      images: updatedImages,
    });
  };

  // Mover imagem para baixo (aumentar ordem)
  const handleMoveDown = (index: number) => {
    if (!slider || index === slider.images.length - 1) return;
    
    const updatedImages = [...slider.images];
    
    // Trocar a ordem das imagens
    const temp = updatedImages[index].order;
    updatedImages[index].order = updatedImages[index + 1].order;
    updatedImages[index + 1].order = temp;
    
    // Reordenar o array com base na nova ordem
    updatedImages.sort((a, b) => a.order - b.order);
    
    setSlider({
      ...slider,
      images: updatedImages,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!slider) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">Slider não encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/settings/slider">Voltar para Sliders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/settings/slider">
            <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{slider.name}</h1>
      </div>

      <form onSubmit={handleUpdateSlider} className="space-y-8">
        {/* Configurações básicas do slider */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Slider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Slider</Label>
              <Input
                id="name"
                value={slider.name}
                onChange={(e) => setSlider({ ...slider, name: e.target.value })}
                placeholder="Ex: Banner Principal"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={slider.description || ''}
                onChange={(e) => setSlider({ ...slider, description: e.target.value })}
                placeholder="Descreva o propósito deste slider"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="width">Largura</Label>
                <Input
                  id="width"
                  value={slider.width}
                  onChange={(e) => setSlider({ ...slider, width: e.target.value })}
                  placeholder="Ex: 100% ou 1200px"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="height">Altura</Label>
                <Input
                  id="height"
                  value={slider.height}
                  onChange={(e) => setSlider({ ...slider, height: e.target.value })}
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
                value={slider.interval}
                onChange={(e) => setSlider({ ...slider, interval: parseInt(e.target.value) })}
                placeholder="Ex: 5000 (5 segundos)"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Gerenciamento de imagens do slider */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Imagens do Slider</CardTitle>
            
            <Dialog open={isAddImageDialogOpen} onOpenChange={setIsAddImageDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Imagem
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Imagem</DialogTitle>
                  <DialogDescription>
                    Adicione uma imagem ao slider com título, subtítulo e botão opcional.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">URL da Imagem</Label>
                    <div className="flex gap-2">
                      <Input
                        id="imageUrl"
                        value={newImage.imageUrl}
                        onChange={(e) => setNewImage({ ...newImage, imageUrl: e.target.value })}
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="flex-grow"
                        required
                      />
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="image-upload"
                          onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('image-upload')?.click()}
                          className="whitespace-nowrap"
                        >
                          Escolher
                        </Button>
                      </div>
                      <Button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={!imageFile || uploadingImage}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" /> Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título (H1)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="title"
                        value={newImage.title}
                        onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                        placeholder="Título principal"
                        className="flex-grow"
                      />
                      <div className="flex items-center gap-2">
                        <Label htmlFor="titleColor" className="whitespace-nowrap">Cor:</Label>
                        <input
                          type="color"
                          id="titleColor"
                          value={newImage.titleColor || '#ffffff'}
                          onChange={(e) => setNewImage({ ...newImage, titleColor: e.target.value })}
                          className="w-10 h-8 p-0 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subtitle">Subtítulo (H2)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="subtitle"
                        value={newImage.subtitle}
                        onChange={(e) => setNewImage({ ...newImage, subtitle: e.target.value })}
                        placeholder="Subtítulo ou descrição"
                        className="flex-grow"
                      />
                      <div className="flex items-center gap-2">
                        <Label htmlFor="subtitleColor" className="whitespace-nowrap">Cor:</Label>
                        <input
                          type="color"
                          id="subtitleColor"
                          value={newImage.subtitleColor || '#ffffff'}
                          onChange={(e) => setNewImage({ ...newImage, subtitleColor: e.target.value })}
                          className="w-10 h-8 p-0 border rounded"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="buttonText">Texto do Botão (opcional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="buttonText"
                          value={newImage.buttonText || ''}
                          onChange={(e) => setNewImage({ ...newImage, buttonText: e.target.value })}
                          placeholder="Ex: Saiba mais"
                          className="flex-grow"
                        />
                        <div className="flex items-center gap-2">
                          <Label htmlFor="buttonTextColor" className="whitespace-nowrap">Cor:</Label>
                          <input
                            type="color"
                            id="buttonTextColor"
                            value={newImage.buttonTextColor || '#ffffff'}
                            onChange={(e) => setNewImage({ ...newImage, buttonTextColor: e.target.value })}
                            className="w-10 h-8 p-0 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="buttonLink">Link do Botão</Label>
                      <div className="flex gap-2">
                        <Input
                          id="buttonLink"
                          value={newImage.buttonLink || ''}
                          onChange={(e) => setNewImage({ ...newImage, buttonLink: e.target.value })}
                          placeholder="Ex: /pagina ou https://..."
                          className="flex-grow"
                        />
                        <div className="flex items-center gap-2">
                          <Label htmlFor="buttonBgColor" className="whitespace-nowrap">Fundo:</Label>
                          <input
                            type="color"
                            id="buttonBgColor"
                            value={newImage.buttonBgColor || '#2563eb'}
                            onChange={(e) => setNewImage({ ...newImage, buttonBgColor: e.target.value })}
                            className="w-10 h-8 p-0 border rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddImageDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleAddImage}>
                    Adicionar Imagem
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent>
            {slider.images.length === 0 ? (
              <div className="text-center py-10 border rounded-md border-dashed">
                <p className="text-muted-foreground mb-4">Nenhuma imagem adicionada a este slider</p>
                <Button onClick={() => setIsAddImageDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Primeira Imagem
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {slider.images.sort((a, b) => a.order - b.order).map((image, index) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-md">
                    <div className="w-24 h-24 relative flex-shrink-0 bg-muted rounded overflow-hidden">
                      {image.imageUrl && (
                        <Image
                          src={image.imageUrl}
                          alt={image.title || `Slide ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="font-medium">{image.title || `Slide ${index + 1}`}</h3>
                      {image.subtitle && <p className="text-sm text-muted-foreground">{image.subtitle}</p>}
                      {image.buttonText && (
                        <div className="mt-2">
                          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                            Botão: {image.buttonText}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2">
                        {image.titleColor && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Título:</span>
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: image.titleColor }}
                            />
                          </div>
                        )}
                        {image.subtitleColor && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Subtítulo:</span>
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: image.subtitleColor }}
                            />
                          </div>
                        )}
                        {image.buttonBgColor && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">Botão:</span>
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: image.buttonBgColor }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === slider.images.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveImage(index)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Botões de ação */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/settings/slider">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
