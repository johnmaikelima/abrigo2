import React, { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

interface MainLayoutProps {
  children: ReactNode;
  categories?: any[];
}

export default async function MainLayout({ children, categories = [] }: MainLayoutProps) {
  // Buscar categorias do servidor diretamente
  let fetchedCategories = categories;
  
  if (categories.length === 0) {
    try {
      // Usar fetch do servidor
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/categories`, {
        cache: 'no-store'
      });
      
      if (response.ok) {
        fetchedCategories = await response.json();
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      // Usar categorias vazias em caso de erro
      fetchedCategories = [];
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header categories={fetchedCategories} />
      <main className="flex-grow md:pt-32 pt-20 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
