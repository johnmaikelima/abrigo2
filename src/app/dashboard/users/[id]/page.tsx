'use client';

import { UserForm } from '@/components/dashboard/users/user-form';

export default function EditUserPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Usuário</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <UserForm userId={params.id} />
      </div>
    </div>
  );
}
