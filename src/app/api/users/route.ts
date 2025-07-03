import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongoose';
import { UserModel } from '@/models/User';
import { withAdminAuth } from './middleware';

// GET /api/users - Listar todos os usuários (apenas para administradores)
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const users = await UserModel.find({})
        .select('-password') // Excluir o campo de senha
        .sort({ createdAt: -1 })
        .lean();
      
      // Converter _id para string
      const formattedUsers = users.map((user: any) => ({
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
      }));
      
      return NextResponse.json(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 });
    }
  });
}

// POST /api/users - Criar um novo usuário
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const body = await req.json();
      const { name, email, password, role = 'author' } = body;
      
      // Validar dados obrigatórios
      if (!name || !email || !password) {
        return NextResponse.json(
          { error: 'Nome, email e senha são obrigatórios' },
          { status: 400 }
        );
      }
      
      // Verificar se o email já está em uso
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Este email já está em uso' },
          { status: 400 }
        );
      }
      
      // Validar role
      const validRoles = ['admin', 'editor', 'author'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Função inválida. Use admin, editor ou author' },
          { status: 400 }
        );
      }
      
      // Hash da senha
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Criar novo usuário
      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      
      // Retornar o usuário criado (sem a senha)
      const userData = newUser.toObject();
      const { password: _, ...userWithoutPassword } = userData;
      
      return NextResponse.json({
        ...userWithoutPassword,
        _id: userData._id ? userData._id.toString() : '',
        createdAt: userData.createdAt?.toISOString(),
        updatedAt: userData.updatedAt?.toISOString(),
      }, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 });
    }
  });
}
