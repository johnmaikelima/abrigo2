'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MenuItem {
  name: string;
  url: string;
  order: number;
  isCTA?: boolean;
}

interface MenuEditorProps {
  menuName: string;
  menuLocation: string;
  menuItems: MenuItem[];
  onMenuNameChange: (name: string) => void;
  onMenuLocationChange: (location: string) => void;
  onAddMenuItem: () => void;
  onRemoveMenuItem: (index: number) => void;
  onUpdateMenuItem: (index: number, field: keyof MenuItem, value: string | number) => void;
  onMoveItemUp: (index: number) => void;
  onMoveItemDown: (index: number) => void;
  onSelectSuggestion: (index: number, url: string, name?: string) => void;
  postSuggestions: Array<{ title: string; slug: string }>;
  categorySuggestions: Array<{ name: string; slug: string }>;
  searchTerm: string;
  onSearchChange: (index: number, value: string) => void;
  showSuggestions: boolean;
  activeMenuItemIndex: number | null;
  setActiveMenuItemIndex: (index: number | null) => void;
  menuLocations: Array<{ id: string; name: string }>;
}

export default function MenuEditor({
  menuName,
  menuLocation,
  menuItems,
  onMenuNameChange,
  onMenuLocationChange,
  onAddMenuItem,
  onRemoveMenuItem,
  onUpdateMenuItem,
  onMoveItemUp,
  onMoveItemDown,
  onSelectSuggestion,
  postSuggestions,
  categorySuggestions,
  searchTerm,
  onSearchChange,
  showSuggestions,
  activeMenuItemIndex,
  setActiveMenuItemIndex,
  menuLocations
}: MenuEditorProps) {
  // Filtrar sugestões com base no termo de pesquisa
  const filteredPostSuggestions = postSuggestions.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCategorySuggestions = categorySuggestions.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="menu-name">Nome do Menu</Label>
            <Input 
              id="menu-name" 
              value={menuName}
              onChange={(e) => onMenuNameChange(e.target.value)}
              placeholder="Ex: Menu Principal, Menu Rodapé"
            />
          </div>
          <div>
            <Label htmlFor="menu-location">Localização</Label>
            <Select 
              value={menuLocation} 
              onValueChange={onMenuLocationChange}
            >
              <SelectTrigger id="menu-location">
                <SelectValue placeholder="Selecione onde este menu será exibido" />
              </SelectTrigger>
              <SelectContent>
                {menuLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Itens do Menu</h3>
          
          {menuItems.map((menuItem, index) => (
            <div key={index} className="border rounded-md p-4 relative">
              <div className="absolute right-2 top-2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMoveItemUp(index)}
                  disabled={index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onMoveItemDown(index)}
                  disabled={index === menuItems.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemoveMenuItem(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`menu-name-${index}`}>Nome do Item</Label>
                  <Input 
                    id={`menu-name-${index}`}
                    value={menuItem.name}
                    onChange={(e) => onUpdateMenuItem(index, 'name', e.target.value)}
                    placeholder="Ex: Início, Sobre, Contato"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`menu-url-${index}`}>URL</Label>
                  <div className="relative">
                    <Input 
                      id={`menu-url-${index}`}
                      value={menuItem.url}
                      onChange={(e) => onSearchChange(index, e.target.value)}
                      placeholder="Ex: /blog, /sobre, /contato"
                      onFocus={() => setActiveMenuItemIndex(index)}
                    />
                    
                    {showSuggestions && activeMenuItemIndex === index && (searchTerm || filteredPostSuggestions.length > 0 || filteredCategorySuggestions.length > 0) && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredPostSuggestions.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs font-semibold bg-gray-100">Posts</div>
                            {filteredPostSuggestions.map((post, i) => (
                              <div 
                                key={`post-${i}`}
                                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => onSelectSuggestion(index, post.slug, post.title)}
                              >
                                {post.title} - <span className="text-gray-500">{post.slug}</span>
                              </div>
                            ))}
                          </>
                        )}
                        
                        {filteredCategorySuggestions.length > 0 && (
                          <>
                            <div className="px-2 py-1 text-xs font-semibold bg-gray-100">Categorias</div>
                            {filteredCategorySuggestions.map((category, i) => (
                              <div 
                                key={`category-${i}`}
                                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => onSelectSuggestion(index, category.slug, category.name)}
                              >
                                {category.name} - <span className="text-gray-500">{category.slug}</span>
                              </div>
                            ))}
                          </>
                        )}
                        
                        {filteredPostSuggestions.length === 0 && filteredCategorySuggestions.length === 0 && searchTerm && (
                          <div className="px-2 py-1 text-sm text-gray-500">
                            Nenhuma sugestão encontrada
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id={`menu-cta-${index}`}
                      checked={!!menuItem.isCTA}
                      onChange={(e) => onUpdateMenuItem(index, 'isCTA', e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`menu-cta-${index}`} className="text-sm font-medium text-gray-700">
                      Botão CTA (Call to Action)
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            onClick={onAddMenuItem}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Item de Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
