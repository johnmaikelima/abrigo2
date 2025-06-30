'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Link as LinkIcon, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  currentImageUrl?: string;
  label?: string;
  helpText?: string;
}

export function ImageUpload({ 
  onImageSelected, 
  currentImageUrl = '', 
  label = 'Imagem', 
  helpText = 'Upload de imagem ou URL externa'
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>(currentImageUrl ? 'url' : 'upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'hero');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao fazer upload da imagem');
      }
      
      const data = await response.json();
      setImageUrl(data.fileUrl);
      onImageSelected(data.fileUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Falha ao enviar imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    onImageSelected(url);
  };

  const handleRemoveImage = () => {
    setImageUrl('');
    onImageSelected('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleInputMode = () => {
    setInputMode(inputMode === 'upload' ? 'url' : 'upload');
    setImageUrl('');
    onImageSelected('');
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor="image-upload">{label}</Label>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={toggleInputMode}
          className="text-xs"
        >
          {inputMode === 'upload' ? (
            <>
              <LinkIcon className="h-3 w-3 mr-1" />
              Usar URL
            </>
          ) : (
            <>
              <Upload className="h-3 w-3 mr-1" />
              Upload
            </>
          )}
        </Button>
      </div>
      
      {inputMode === 'upload' ? (
        <div className="space-y-2">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            ref={fileInputRef}
            className="cursor-pointer"
          />
          <p className="text-xs text-muted-foreground">{helpText}</p>
        </div>
      ) : (
        <div className="space-y-2">
          <Input
            id="image-url"
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={imageUrl}
            onChange={handleUrlChange}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Insira a URL completa da imagem</p>
        </div>
      )}
      
      {isUploading && (
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Enviando...</span>
        </div>
      )}
      
      {imageUrl && !isUploading && (
        <div className="space-y-2">
          <div className="relative border rounded-md overflow-hidden h-40">
            <img 
              src={imageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
                toast.error('Não foi possível carregar a imagem');
              }}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {imageUrl}
          </p>
        </div>
      )}
    </div>
  );
}
