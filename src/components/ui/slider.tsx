'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SliderImage {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
  titleColor?: string;
  subtitleColor?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
}

interface SliderProps {
  id?: string;
  images: SliderImage[];
  width?: string;
  height?: string;
  interval?: number;
  autoplay?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  defaultTitleColor?: string;
  defaultSubtitleColor?: string;
  defaultButtonTextColor?: string;
  defaultButtonBgColor?: string;
}

export default function Slider({
  id,
  images,
  width = '100%',
  height = '400px',
  interval = 5000,
  autoplay = true,
  showArrows = true,
  showDots = true,
  className,
  defaultTitleColor = '#ffffff',
  defaultSubtitleColor = '#ffffff',
  defaultButtonTextColor = '#ffffff',
  defaultButtonBgColor = '#2563eb',
}: SliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalSlides = images.length;

  // Ordenar imagens por ordem
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  // Função para avançar para o próximo slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  // Função para voltar ao slide anterior
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // Função para ir para um slide específico
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Configurar o timer para avançar slides automaticamente
  useEffect(() => {
    if (isPlaying && totalSlides > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, interval, totalSlides]);

  // Pausar o slider quando o mouse estiver sobre ele
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Retomar o slider quando o mouse sair
  const handleMouseLeave = () => {
    if (isPlaying && totalSlides > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }
  };

  // Se não houver imagens, não renderizar nada
  if (totalSlides === 0) {
    return null;
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ width, height }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      id={id}
    >
      {/* Slides */}
      <div className="h-full">
        {sortedImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute top-0 left-0 w-full h-full transition-opacity duration-500",
              currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            {/* Imagem de fundo */}
            <div className="absolute inset-0">
              <Image
                src={image.imageUrl}
                alt={image.title || `Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay escuro para melhorar a legibilidade do texto */}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Conteúdo do slide */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4">
              {image.title && (
                <h1 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-3xl"
                  style={{ color: image.titleColor || defaultTitleColor }}
                >
                  {image.title}
                </h1>
              )}
              
              {image.subtitle && (
                <h2 
                  className="text-xl md:text-2xl mb-6 max-w-2xl"
                  style={{ color: image.subtitleColor || defaultSubtitleColor }}
                >
                  {image.subtitle}
                </h2>
              )}
              
              {image.buttonText && image.buttonLink && (
                <Button 
                  asChild 
                  className="mt-4" 
                  size="lg"
                  style={{
                    backgroundColor: image.buttonBgColor || defaultButtonBgColor,
                    color: image.buttonTextColor || defaultButtonTextColor,
                    borderColor: image.buttonBgColor || defaultButtonBgColor
                  }}
                >
                  <Link href={image.buttonLink}>
                    {image.buttonText}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicadores de slide (bolinhas) */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
          {sortedImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                currentSlide === index
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
