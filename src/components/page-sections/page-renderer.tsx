'use client';

import React from 'react';
import { HeroSection } from './hero-section';
import { FeaturesSection } from './features-section';
import { ContentSection } from './content-section';
import { TestimonialsSection } from './testimonials-section';
import { CTASection } from './cta-section';

interface Section {
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  textColor?: string;
  imageUrl?: string;
  style?: string;
  images?: string[];
  items?: any[];
  order?: number;
}

interface PageRendererProps {
  sections: Section[];
}

export function PageRenderer({ sections }: PageRendererProps) {
  // Ordenar seções pela propriedade order, se existir
  const sortedSections = [...sections].sort((a, b) => {
    const orderA = a.order !== undefined ? a.order : 999;
    const orderB = b.order !== undefined ? b.order : 999;
    return orderA - orderB;
  });

  return (
    <div className="page-content">
      {sortedSections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return (
              <HeroSection
                key={`${section.type}-${index}`}
                title={section.title || ''}
                subtitle={section.subtitle}
                content={section.content}
                buttonText={section.buttonText}
                buttonLink={section.buttonLink}
                backgroundColor={section.backgroundColor}
                textColor={section.textColor}
                imageUrl={section.imageUrl}
                style={section.style}
                images={section.images}
              />
            );
          
          case 'features':
            return (
              <FeaturesSection
                key={`${section.type}-${index}`}
                title={section.title || ''}
                subtitle={section.subtitle}
                items={section.items || []}
                backgroundColor={section.backgroundColor}
                textColor={section.textColor}
              />
            );
          
          case 'content':
            return (
              <ContentSection
                key={`${section.type}-${index}`}
                title={section.title}
                content={section.content || ''}
                backgroundColor={section.backgroundColor}
                textColor={section.textColor}
              />
            );
          
          case 'testimonials':
            return (
              <TestimonialsSection
                key={`${section.type}-${index}`}
                title={section.title || ''}
                subtitle={section.subtitle}
                items={section.items || []}
                backgroundColor={section.backgroundColor}
                textColor={section.textColor}
              />
            );
          
          case 'cta':
            return (
              <CTASection
                key={`${section.type}-${index}`}
                title={section.title || ''}
                content={section.content}
                buttonText={section.buttonText || 'Saiba mais'}
                buttonLink={section.buttonLink || '#'}
                backgroundColor={section.backgroundColor}
                textColor={section.textColor}
              />
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
}
