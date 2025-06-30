'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/image-upload';
import { X } from 'lucide-react';

interface HeroSectionProps {
  section: {
    type: string;
    style?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    imageUrl?: string;
    images?: string[];
  };
  onUpdate: (updatedSection: any) => void;
}

export function HeroSectionEditor({ section, onUpdate }: HeroSectionProps) {
  const [sectionData, setSectionData] = useState({
    style: section.style || 'default',
    title: section.title || '',
    subtitle: section.subtitle || '',
    content: section.content || '',
    buttonText: section.buttonText || '',
    buttonLink: section.buttonLink || '',
    backgroundColor: section.backgroundColor || '#f8fafc',
    textColor: section.textColor || '#1e293b',
    imageUrl: section.imageUrl || '',
    images: section.images || []
  });

  useEffect(() => {
    setSectionData({
      style: section.style || 'default',
      title: section.title || '',
      subtitle: section.subtitle || '',
      content: section.content || '',
      buttonText: section.buttonText || '',
      buttonLink: section.buttonLink || '',
      backgroundColor: section.backgroundColor || '#f8fafc',
      textColor: section.textColor || '#1e293b',
      imageUrl: section.imageUrl || '',
      images: section.images || []
    });
  }, [section]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSectionData(prev => ({
      ...prev,
      [name]: value
    }));

    onUpdate({
      ...section,
      [name]: value
    });
  };

  const handleImageSelected = (imageUrl: string) => {
    setSectionData(prev => ({
      ...prev,
      imageUrl
    }));

    onUpdate({
      ...section,
      imageUrl
    });
  };
  
  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const style = e.target.value;
    setSectionData(prev => ({
      ...prev,
      style
    }));
    
    onUpdate({
      ...section,
      style
    });
  };
  
  const handleCarouselImageSelected = (imageUrl: string) => {
    const newImages = [...sectionData.images, imageUrl];
    setSectionData(prev => ({
      ...prev,
      images: newImages
    }));
    
    onUpdate({
      ...section,
      images: newImages
    });
  };
  
  const handleRemoveCarouselImage = (index: number) => {
    const newImages = [...sectionData.images];
    newImages.splice(index, 1);
    
    setSectionData(prev => ({
      ...prev,
      images: newImages
    }));
    
    onUpdate({
      ...section,
      images: newImages
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Editar Seção Hero</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="style">Estilo da Seção</Label>
          <select
            id="style"
            name="style"
            value={sectionData.style}
            onChange={handleStyleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="default">Padrão (Imagem de fundo)</option>
            <option value="carousel">Conteúdo à esquerda + Carrossel à direita</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Escolha o estilo de layout para esta seção Hero
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={sectionData.title}
            onChange={handleChange}
            placeholder="Título principal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtítulo</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={sectionData.subtitle}
            onChange={handleChange}
            placeholder="Subtítulo ou slogan"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            name="content"
            value={sectionData.content}
            onChange={handleChange}
            placeholder="Conteúdo HTML da seção"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Você pode usar HTML para formatação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="buttonText">Texto do Botão</Label>
            <Input
              id="buttonText"
              name="buttonText"
              value={sectionData.buttonText}
              onChange={handleChange}
              placeholder="Ex: Saiba Mais"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="buttonLink">Link do Botão</Label>
            <Input
              id="buttonLink"
              name="buttonLink"
              value={sectionData.buttonLink}
              onChange={handleChange}
              placeholder="Ex: /contato ou https://..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                name="backgroundColor"
                type="color"
                value={sectionData.backgroundColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                name="backgroundColor"
                value={sectionData.backgroundColor}
                onChange={handleChange}
                placeholder="#ffffff"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Cor do Texto</Label>
            <div className="flex gap-2">
              <Input
                id="textColor"
                name="textColor"
                type="color"
                value={sectionData.textColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                type="text"
                name="textColor"
                value={sectionData.textColor}
                onChange={handleChange}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {sectionData.style === 'default' && (
          <div className="space-y-2">
            <ImageUpload
              onImageSelected={handleImageSelected}
              currentImageUrl={sectionData.imageUrl}
              label="Imagem de Fundo"
              helpText="Adicione uma imagem de fundo para a seção hero (opcional)"
            />
            <p className="text-xs text-muted-foreground">
              {sectionData.imageUrl ? 
                "A imagem de fundo terá prioridade sobre a cor de fundo" : 
                "Se não definir uma imagem, a cor de fundo será utilizada"}
            </p>
          </div>
        )}
        
        {sectionData.style === 'carousel' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Imagens do Carrossel</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Adicione imagens para o carrossel que será exibido à direita do conteúdo
              </p>
              
              {/* Lista de imagens do carrossel */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {sectionData.images.map((imageUrl, index) => (
                  <div key={index} className="relative border rounded-md overflow-hidden h-24">
                    <img 
                      src={imageUrl} 
                      alt={`Carrossel ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => handleRemoveCarouselImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Upload de nova imagem para o carrossel */}
              <div className="border-t pt-4">
                <ImageUpload
                  onImageSelected={handleCarouselImageSelected}
                  currentImageUrl=""
                  label="Adicionar Imagem ao Carrossel"
                  helpText="Adicione mais imagens ao carrossel"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
