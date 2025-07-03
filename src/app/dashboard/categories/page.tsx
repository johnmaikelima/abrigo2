'use client';

import React, { useState, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Plus, Trash2, Edit, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Carregar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          toast.error('Erro ao carregar categorias');
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast.error('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Gerar slug a partir do nome
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
  };

  // Atualizar slug quando o nome mudar
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing = false) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    
    if (isEditing && editingCategory) {
      setEditingCategory({ ...editingCategory, name, slug });
    } else {
      setNewCategory({ ...newCategory, name, slug });
    }
  };

  // Adicionar nova categoria
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name) {
      toast.error('O nome da categoria é obrigatório');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        const addedCategory = await response.json();
        setCategories([...categories, addedCategory]);
        setNewCategory({ name: '', slug: '', description: '' });
        toast.success('Categoria adicionada com sucesso!');
      } else {
        toast.error('Erro ao adicionar categoria');
      }
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error);
      toast.error('Erro ao adicionar categoria');
    }
  };

  // Iniciar edição de categoria
  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
  };

  // Cancelar edição
  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  // Salvar edição
  const handleSaveEdit = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCategory),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(
          categories.map((cat) => (cat._id === updatedCategory._id ? updatedCategory : cat))
        );
        setEditingCategory(null);
        toast.success('Categoria atualizada com sucesso!');
      } else {
        toast.error('Erro ao atualizar categoria');
      }
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      toast.error('Erro ao atualizar categoria');
    }
  };

  // Excluir categoria
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCategories(categories.filter((cat) => cat._id !== id));
        toast.success('Categoria excluída com sucesso!');
      } else {
        toast.error('Erro ao excluir categoria');
      }
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      toast.error('Erro ao excluir categoria');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Categorias</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Carregando categorias...</div>
              ) : categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center justify-between p-4 border rounded-md bg-white"
                    >
                      {editingCategory && editingCategory._id === category._id ? (
                        <div className="flex-1 space-y-2">
                          <Input
                            value={editingCategory.name}
                            onChange={(e) => handleNameChange(e, true)}
                            placeholder="Nome da categoria"
                          />
                          <Input
                            value={editingCategory.slug}
                            onChange={(e) =>
                              setEditingCategory({ ...editingCategory, slug: e.target.value })
                            }
                            placeholder="Slug"
                          />
                          <Input
                            value={editingCategory.description || ''}
                            onChange={(e) =>
                              setEditingCategory({
                                ...editingCategory,
                                description: e.target.value,
                              })
                            }
                            placeholder="Descrição (opcional)"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={handleSaveEdit}>
                              <Save className="h-4 w-4 mr-1" /> Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            <p className="text-sm text-gray-500">/{category.slug}</p>
                            {category.description && (
                              <p className="text-sm mt-1">{category.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStartEdit(category)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteCategory(category._id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Nenhuma categoria encontrada. Adicione sua primeira categoria!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </label>
                  <Input
                    id="name"
                    value={newCategory.name}
                    onChange={handleNameChange}
                    placeholder="Nome da categoria"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium mb-1">
                    Slug
                  </label>
                  <Input
                    id="slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="slug-da-categoria"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Descrição (opcional)
                  </label>
                  <Input
                    id="description"
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, description: e.target.value })
                    }
                    placeholder="Descrição da categoria"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-1" /> Adicionar Categoria
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
