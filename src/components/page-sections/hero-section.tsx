'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HtmlContent } from './html-content';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  style?: string;
  images?: string[];
}

export function HeroSection({
  title,
  subtitle,
  content,
  buttonText,
  buttonLink,
  backgroundColor = '#f8fafc',
  textColor = '#1e293b',
  imageUrl,
  style = 'default',
  images = []
}: HeroSectionProps) {
  // Determinar se temos uma imagem de fundo
  const hasBackgroundImage = style === 'default' && !!imageUrl;
  const isCarouselStyle = style === 'carousel';
  
  // Estado para controlar o carrossel
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Função para avançar para o próximo slide
  const nextSlide = () => {
    if (images.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }
  };
  
  // Função para voltar para o slide anterior
  const prevSlide = () => {
    if (images.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    }
  };
  
  // Avançar automaticamente o carrossel a cada 5 segundos
  useEffect(() => {
    if (isCarouselStyle && images.length > 1) {
      const interval = setInterval(() => {
        nextSlide();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isCarouselStyle, images.length]);
  
  return (
    <section 
      className={`py-16 px-4 md:px-6 lg:px-8 relative ${hasBackgroundImage ? 'min-h-[500px] flex items-center' : ''}`}
      style={{ 
        backgroundColor: hasBackgroundImage ? 'transparent' : backgroundColor,
        color: textColor
      }}
    >
      {hasBackgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${imageUrl})`,
              opacity: 0.8 // Ajuste a opacidade conforme necessário
            }}
          />
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundColor: 'rgba(0,0,0,0.4)' // Overlay escuro para melhorar a legibilidade do texto
            }}
          />
        </div>
      )}
      {/* Estilo padrão com imagem de fundo */}
      {style === 'default' && (
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="text-center mb-8">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4" 
              style={{ color: hasBackgroundImage ? '#ffffff' : textColor }}
            >
              {title}
            </h1>
            
            {subtitle && (
              <h2 
                className="text-xl md:text-2xl mb-6 opacity-90" 
                style={{ color: hasBackgroundImage ? '#ffffff' : textColor }}
              >
                {subtitle}
              </h2>
            )}
            
            {content && (
              <div 
                className="max-w-3xl mx-auto mb-8" 
                style={{ color: hasBackgroundImage ? '#ffffff' : 'inherit' }}
              >
                <HtmlContent content={content} />
              </div>
            )}
            
            {buttonText && buttonLink && (
              <Button 
                asChild 
                size="lg" 
                className={`mt-4 ${hasBackgroundImage ? 'bg-white text-black hover:bg-gray-200' : ''}`}
                variant={hasBackgroundImage ? 'outline' : 'default'}
              >
                <Link href={buttonLink}>
                  {buttonText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Estilo com conteúdo à esquerda e carrossel à direita */}
      {style === 'carousel' && (
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Conteúdo à esquerda */}
            <div className="mb-8 md:mb-0">
              <h1 
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" 
                style={{ color: textColor }}
              >
                {title}
              </h1>
              
              {subtitle && (
                <h2 
                  className="text-lg md:text-xl mb-6 opacity-90" 
                  style={{ color: textColor }}
                >
                  {subtitle}
                </h2>
              )}
              
              {content && (
                <div className="mb-8" style={{ color: 'inherit' }}>
                  <HtmlContent content={content} />
                </div>
              )}
              
              {buttonText && buttonLink && (
                <Button 
                  asChild 
                  size="lg"
                >
                  <Link href={buttonLink}>
                    {buttonText}
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Carrossel à direita */}
            <div className="relative overflow-hidden rounded-lg shadow-lg h-[400px]">
              {images.length > 0 ? (
                <>
                  <div className="relative h-full w-full">
                    {images.map((img, index) => (
                      <div 
                        key={index}
                        className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                        style={{
                          opacity: index === currentSlide ? 1 : 0,
                          zIndex: index === currentSlide ? 10 : 0
                        }}
                      >
                        <div 
                          className="h-full w-full bg-cover bg-center"
                          style={{ backgroundImage: `url(${img})` }}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Controles do carrossel */}
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4 z-20">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/70 hover:bg-white rounded-full"
                        onClick={prevSlide}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="bg-white/70 hover:bg-white rounded-full"
                        onClick={nextSlide}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </div>
                  )}
                  
                  {/* Indicadores */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Ir para slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100">
                  <p className="text-gray-500">Adicione imagens ao carrossel</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
