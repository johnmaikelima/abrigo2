'use client';

import React from 'react';
import { HtmlContent } from './html-content';

interface ContentSectionProps {
  title?: string;
  content: string;
  backgroundColor?: string;
  textColor?: string;
}

export function ContentSection({
  title,
  content,
  backgroundColor = '#ffffff',
  textColor = '#1e293b'
}: ContentSectionProps) {
  return (
    <section 
      className="py-16 px-4 md:px-6 lg:px-8"
      style={{ 
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      <div className="container mx-auto max-w-4xl">
        {title && (
          <h2 
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
            style={{ color: textColor }}
          >
            {title}
          </h2>
        )}
        
        <div className="prose prose-lg max-w-none">
          <HtmlContent 
            content={content} 
            className="[&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-6 [&>h3]:mb-3"
          />
        </div>
      </div>
    </section>
  );
}
