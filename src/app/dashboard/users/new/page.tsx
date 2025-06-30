'use client';

import { UserForm } from '@/components/dashboard/users/user-form';

export default function NewUserPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Criar Novo Usuário</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <UserForm />
      </div>
    </div>
  );
}
