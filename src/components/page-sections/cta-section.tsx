'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { HtmlContent } from './html-content';
import Link from 'next/link';

interface CTASectionProps {
  title: string;
  content?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
  textColor?: string;
}

export function CTASection({
  title,
  content,
  buttonText,
  buttonLink,
  backgroundColor = '#2563eb',
  textColor = '#ffffff'
}: CTASectionProps) {
  return (
    <section 
      className="py-16 px-4 md:px-6 lg:px-8"
      style={{ 
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2 
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ color: textColor }}
        >
          {title}
        </h2>
        
        {content && (
          <div className="max-w-2xl mx-auto mb-8">
            <HtmlContent 
              content={content} 
              className="text-lg opacity-90"
            />
          </div>
        )}
        
        <Button 
          asChild 
          size="lg" 
          variant="outline"
          className="bg-white hover:bg-gray-100 text-primary"
        >
          <Link href={buttonLink}>
            {buttonText}
          </Link>
        </Button>
      </div>
    </section>
  );
}
