'use client';

import React, { useState, useEffect } from 'react';
import Slider from '@/components/ui/slider';

interface SliderImage {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
}

interface ISlider {
  _id: string;
  name: string;
  description?: string;
  width: string;
  height: string;
  interval: number;
  images: SliderImage[];
}

interface SliderContainerProps {
  sliderId: string;
  className?: string;
}

export default function SliderContainer({ sliderId, className }: SliderContainerProps) {
  const [slider, setSlider] = useState<ISlider | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlider = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/sliders/${sliderId}`);
        
        if (response.ok) {
          const data = await response.json();
          setSlider(data);
        } else {
          setError('Não foi possível carregar o slider');
        }
      } catch (error) {
        console.error('Erro ao buscar slider:', error);
        setError('Erro ao carregar o slider');
      } finally {
        setLoading(false);
      }
    };

    if (sliderId) {
      fetchSlider();
    }
  }, [sliderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ height: '400px' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !slider) {
    return null;
  }

  return (
    <Slider
      id={`slider-${sliderId}`}
      images={slider.images}
      width={slider.width}
      height={slider.height}
      interval={slider.interval}
      className={className}
    />
  );
}
