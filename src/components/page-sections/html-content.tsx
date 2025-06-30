'use client';

import React from 'react';

interface HtmlContentProps {
  content: string;
  className?: string;
}

/**
 * Componente para renderizar conteúdo HTML de forma segura
 */
export function HtmlContent({ content, className = '' }: HtmlContentProps) {
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
}
