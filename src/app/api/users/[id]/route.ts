import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongoose';
import { UserModel } from '@/models/User';
import { withAdminAuth } from '../middleware';

// GET /api/users/[id] - Obter um usuário específico
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const user = await UserModel.findById(params.id)
        .select('-password')
        .lean();
      
      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }
      
      // Formatar o usuário para o frontend
      return NextResponse.json({
        ...user,
        _id: user._id ? user._id.toString() : '',
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return NextResponse.json({ error: 'Erro ao buscar usuário' }, { status: 500 });
    }
  });
}

// PUT /api/users/[id] - Atualizar um usuário
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const body = await req.json();
      const { name, email, password, role } = body;
      
      // Verificar se o usuário existe
      const user = await UserModel.findById(params.id);
      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }
      
      // Verificar se o email já está em uso por outro usuário
      if (email && email !== user.email) {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
          return NextResponse.json(
            { error: 'Este email já está em uso' },
            { status: 400 }
          );
        }
      }
      
      // Preparar dados para atualização
      const updateData: any = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (role) {
        const validRoles = ['admin', 'editor', 'author'];
        if (!validRoles.includes(role)) {
          return NextResponse.json(
            { error: 'Função inválida. Use admin, editor ou author' },
            { status: 400 }
          );
        }
        updateData.role = role;
      }
      
      // Hash da senha se fornecida
      if (password) {
        const saltRounds = 10;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }
      
      // Atualizar usuário
      const updatedUser = await UserModel.findByIdAndUpdate(
        params.id,
        { $set: updateData },
        { new: true }
      ).select('-password').lean();
      
      if (!updatedUser) {
        return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
      }
      
      // Formatar o usuário para o frontend
      return NextResponse.json({
        ...updatedUser,
        _id: updatedUser._id ? updatedUser._id.toString() : '',
        createdAt: updatedUser.createdAt?.toISOString(),
        updatedAt: updatedUser.updatedAt?.toISOString(),
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }
  });
}

// DELETE /api/users/[id] - Excluir um usuário
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      // Verificar se o usuário existe
      const user = await UserModel.findById(params.id);
      if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
      }
      
      // Verificar se é o último administrador
      if (user.role === 'admin') {
        const adminCount = await UserModel.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return NextResponse.json(
            { error: 'Não é possível excluir o último administrador' },
            { status: 400 }
          );
        }
      }
      
      // Excluir o usuário
      await UserModel.findByIdAndDelete(params.id);
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
    }
  });
}
