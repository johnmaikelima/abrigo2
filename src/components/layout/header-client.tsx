'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';

interface MenuItem {
  name: string;
  url: string;
  order: number;
  isCTA?: boolean;
}

interface Menu {
  name: string;
  location: string;
  items: MenuItem[];
}

interface HeaderClientProps {
  categories?: any[];
  blogSettings?: {
    name: string;
    description: string;
    logo: string;
    menus?: Menu[];
  };
}

export default function HeaderClient({ categories = [], blogSettings }: HeaderClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [localCategories, setLocalCategories] = useState<any[]>(categories);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  
  // Encontrar o menu do cabeçalho
  const headerMenu = blogSettings?.menus?.find(menu => menu.location === 'header');
  // Ordenar os itens do menu por ordem
  const menuItems = headerMenu?.items?.sort((a, b) => a.order - b.order) || [];
  
  // Desativar o menu de categorias
  const showCategoriesMenu = false;

  // Efeito para detectar rolagem e tamanho da tela
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Detectar tamanho inicial da tela
    handleResize();
    
    // Adicionar event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    // Remover event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Buscar categorias se não forem fornecidas como props
  useEffect(() => {
    if (categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch('/api/categories');
          if (response.ok) {
            const data = await response.json();
            setLocalCategories(data);
          }
        } catch (error) {
          console.error('Erro ao buscar categorias:', error);
        }
      };

      fetchCategories();
    } else {
      setLocalCategories(categories);
    }
  }, [categories]);

  return (
    <header 
      className={`fixed left-0 right-0 z-40 bg-white w-full transition-all duration-300 ${
        scrolled ? 'shadow-md py-2' : 'py-4'
      } ${isMobile ? 'top-0' : 'top-[32px]'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={blogSettings?.logo || "/logo.png"}
              alt={`${blogSettings?.name || "Blog"} Logo`}
              width={150}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Renderizar itens do menu configurados */}
            {menuItems.length > 0 ? (
              menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.url}
                  className={item.isCTA 
                    ? `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium` 
                    : `text-base font-medium transition-colors hover:text-blue-600 ${
                        pathname === item.url ? 'text-blue-600' : 'text-gray-800'
                      }`
                  }
                >
                  {item.name}
                </Link>
              ))
            ) : (
              // Menu padrão caso não haja itens configurados
              <>
                <Link
                  href="/"
                  className={`text-base font-medium transition-colors hover:text-blue-600 ${
                    pathname === '/' ? 'text-blue-600' : 'text-gray-800'
                  }`}
                >
                  Início
                </Link>
                <Link
                  href="/sobre"
                  className={`text-base font-medium transition-colors hover:text-blue-600 ${
                    pathname === '/sobre' ? 'text-blue-600' : 'text-gray-800'
                  }`}
                >
                  Sobre Nós
                </Link>
              </>
            )}
            
            {/* Dropdown de Categorias - oculto */}
            {showCategoriesMenu && (
              <div className="relative group">
                <button
                  className={`flex items-center text-base font-medium transition-colors hover:text-blue-600 ${
                    pathname?.startsWith('/categorias') ? 'text-blue-600' : 'text-gray-800'
                  }`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  Categorias
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    {localCategories.length > 0 ? (
                      localCategories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categorias/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    ) : (
                      <span className="block px-4 py-2 text-sm text-gray-500">
                        Nenhuma categoria
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Botão do Menu Mobile */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {/* Renderizar itens do menu configurados */}
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    className={item.isCTA 
                      ? `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-center` 
                      : `text-base font-medium transition-colors hover:text-blue-600 ${
                          pathname === item.url ? 'text-blue-600' : 'text-gray-800'
                        }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))
              ) : (
                // Menu padrão caso não haja itens configurados
                <>
                  <Link
                    href="/"
                    className={`text-base font-medium transition-colors hover:text-blue-600 ${
                      pathname === '/' ? 'text-blue-600' : 'text-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Início
                  </Link>
                  <Link
                    href="/sobre"
                    className={`text-base font-medium transition-colors hover:text-blue-600 ${
                      pathname === '/sobre' ? 'text-blue-600' : 'text-gray-800'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sobre Nós
                  </Link>
                </>
              )}
              {/* Categorias no menu mobile - oculto */}
              {showCategoriesMenu && (
                <div className="py-2">
                  <div 
                    className="flex justify-between items-center"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="text-gray-700">Categorias</span>
                    <ChevronDown size={16} />
                  </div>
                  
                  {isDropdownOpen && (
                    <div className="pl-4 mt-2 space-y-2">
                      {localCategories.map((category) => (
                        <Link 
                          key={category._id} 
                          href={`/categorias/${category.slug}`}
                          className="block py-1 text-gray-600"
                          onClick={() => {
                            setIsDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
