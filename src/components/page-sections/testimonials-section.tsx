'use client';

import React from 'react';
import { HtmlContent } from './html-content';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface TestimonialItem {
  content: string;
  title: string;
  subtitle?: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle?: string;
  items: TestimonialItem[];
  backgroundColor?: string;
  textColor?: string;
}

export function TestimonialsSection({
  title,
  subtitle,
  items,
  backgroundColor = '#f8fafc',
  textColor = '#1e293b'
}: TestimonialsSectionProps) {
  return (
    <section 
      className="py-16 px-4 md:px-6 lg:px-8"
      style={{ 
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg opacity-80 max-w-3xl mx-auto" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Card key={index} className="border bg-card shadow-sm">
              <CardContent className="pt-6">
                <div className="text-4xl text-primary mb-4">"</div>
                <HtmlContent 
                  content={item.content} 
                  className="italic text-muted-foreground"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-4 border-t">
                <div className="font-semibold">{item.title}</div>
                {item.subtitle && (
                  <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
