'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { UsersTable } from '@/components/dashboard/users/users-table';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/users');
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao buscar usuários');
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setError(error instanceof Error ? error.message : 'Erro ao buscar usuários');
      toast.error(error instanceof Error ? error.message : 'Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchUsers}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>
      <UsersTable users={users} onRefresh={fetchUsers} />
    </div>
  );
}
