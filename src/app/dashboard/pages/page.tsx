'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Edit, Trash2, Eye, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';

interface Page {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  // Buscar páginas
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/pages');
        
        if (response.ok) {
          const data = await response.json();
          // Serializar objetos do MongoDB para evitar warnings
          const serializedPages = serializeMongoDBObject(data);
          setPages(serializedPages);
        } else {
          toast.error('Erro ao carregar páginas');
        }
      } catch (error) {
        console.error('Erro ao buscar páginas:', error);
        toast.error('Erro ao carregar páginas');
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  // Excluir página
  const handleDeletePage = async () => {
    if (!pageToDelete) return;
    
    try {
      const response = await fetch(`/api/pages/${pageToDelete}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPages(pages.filter(page => page._id !== pageToDelete));
        toast.success('Página excluída com sucesso');
      } else {
        toast.error('Erro ao excluir página');
      }
    } catch (error) {
      console.error('Erro ao excluir página:', error);
      toast.error('Erro ao excluir página');
    } finally {
      setPageToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Páginas</h1>
          <p className="text-muted-foreground">Gerencie páginas estáticas do seu site</p>
        </div>
        <Button onClick={() => router.push('/dashboard/pages/new')}>
          <Plus className="h-4 w-4 mr-2" /> Nova Página
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Nenhuma página criada</h3>
            <p className="text-muted-foreground mb-6">
              Crie páginas estáticas para seu site como Sobre, Serviços, Contato, etc.
            </p>
            <Button onClick={() => router.push('/dashboard/pages/new')}>
              <Plus className="h-4 w-4 mr-2" /> Criar Primeira Página
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="truncate">{page.title}</CardTitle>
                  {page.isPublished ? (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Publicada
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                      Rascunho
                    </span>
                  )}
                </div>
                <CardDescription className="truncate">/{page.slug}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Criada em {formatDate(page.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Atualizada em {formatDate(page.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between pt-3 border-t">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/${page.slug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-1" /> Visualizar
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/pages/${page._id}`)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setPageToDelete(page._id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Tutorial Card */}
      <Card>
        <CardHeader>
          <CardTitle>Como usar páginas estáticas</CardTitle>
          <CardDescription>
            Crie páginas otimizadas para SEO com conteúdo personalizado ou gerado por IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-1">
              <h3 className="font-medium">1. Crie uma nova página</h3>
              <p className="text-sm text-muted-foreground">
                Clique no botão "Nova Página" e defina um título e slug (URL) para sua página.
              </p>
            </div>
            
            <div className="grid gap-1">
              <h3 className="font-medium">2. Adicione conteúdo</h3>
              <p className="text-sm text-muted-foreground">
                Você pode adicionar conteúdo manualmente ou usar a IA para gerar conteúdo estruturado.
              </p>
            </div>
            
            <div className="grid gap-1">
              <h3 className="font-medium">3. Personalize as seções</h3>
              <p className="text-sm text-muted-foreground">
                Adicione e organize seções como cabeçalho, recursos, depoimentos, chamadas para ação, etc.
              </p>
            </div>
            
            <div className="grid gap-1">
              <h3 className="font-medium">4. Otimize para SEO</h3>
              <p className="text-sm text-muted-foreground">
                Adicione meta tags, descrições e palavras-chave para melhorar o ranqueamento nos motores de busca.
              </p>
            </div>
            
            <div className="grid gap-1">
              <h3 className="font-medium">5. Publique sua página</h3>
              <p className="text-sm text-muted-foreground">
                Quando estiver satisfeito com o resultado, publique a página para torná-la visível no seu site.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de confirmação para excluir página */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir página</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta página? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
