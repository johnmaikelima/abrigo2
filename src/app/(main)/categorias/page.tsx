'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Em um ambiente real, isso seria uma chamada à API
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Erro ao buscar categorias');
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        
        // Dados simulados para desenvolvimento
        const mockCategories = [
          {
            _id: '1',
            name: 'Tecnologia',
            slug: 'tecnologia',
            description: 'Artigos sobre as últimas tendências em tecnologia'
          },
          {
            _id: '2',
            name: 'Design',
            slug: 'design',
            description: 'Dicas e tutoriais sobre design gráfico e UX/UI'
          },
          {
            _id: '3',
            name: 'Desenvolvimento',
            slug: 'desenvolvimento',
            description: 'Tutoriais e melhores práticas para desenvolvimento web'
          },
          {
            _id: '4',
            name: 'Marketing',
            slug: 'marketing',
            description: 'Estratégias e táticas de marketing digital'
          }
        ];
        
        setCategories(mockCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Header */}
      <section className="py-16 border-b border-gray-200">
        <h1 className="text-4xl font-bold mb-4">Categorias</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Explore nossos artigos por categoria e encontre conteúdo relevante para seus interesses.
        </p>
      </section>

      {/* Lista de categorias */}
      <section className="py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link 
                  key={category._id}
                  href={`/categorias/${category.slug}`}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                >
                  <h2 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-gray-600 mb-4">{category.description}</p>
                  )}
                  <div className="flex items-center text-blue-600 font-medium">
                    Ver artigos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-medium mb-2">Nenhuma categoria encontrada</h3>
                <p className="text-gray-600">
                  Ainda não há categorias cadastradas.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
