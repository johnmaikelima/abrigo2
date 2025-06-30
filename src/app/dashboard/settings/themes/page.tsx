'use client';

import dynamic from 'next/dynamic';

// Importar o componente de forma dinâmica para evitar problemas de SSR
const ThemePage = dynamic(() => import('./theme-page'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <p>Carregando configurações do tema...</p>
    </div>
  ),
});

export default function ThemesPage() {
  return <ThemePage />;
}
