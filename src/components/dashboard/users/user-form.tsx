'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface UserFormProps {
  userId?: string;
}

export function UserForm({ userId }: UserFormProps) {
  const router = useRouter();
  const isEditing = !!userId;
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'author',
  });

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao buscar usuário');
      }
      
      const user = await response.json();
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Não preenchemos a senha ao editar
        role: user.role,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar usuário');
      router.push('/dashboard/users');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validar dados
      if (!formData.name || !formData.email || (!isEditing && !formData.password)) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Preparar dados para envio
      const userData = {
        ...formData,
        // Se estiver editando e a senha estiver vazia, não enviar a senha
        ...(isEditing && !formData.password && { password: undefined }),
      };

      const response = await fetch(
        isEditing ? `/api/users/${userId}` : '/api/users',
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário`);
      }

      toast.success(`Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso`);
      router.push('/dashboard/users');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nome do usuário"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@exemplo.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {isEditing ? 'Senha (deixe em branco para manter a atual)' : 'Senha'}
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required={!isEditing}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Função</Label>
        <Select
          value={formData.role}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="author">Autor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/dashboard/users')}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Salvando...' : 'Criando...'}
            </>
          ) : (
            isEditing ? 'Salvar' : 'Criar'
          )}
        </Button>
      </div>
    </form>
  );
}
