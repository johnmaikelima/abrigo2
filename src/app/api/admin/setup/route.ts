import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { UserModel } from '@/models/User';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Schema de validação para o corpo da requisição
const setupSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export async function POST(req: NextRequest) {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Verificar se já existe algum usuário administrador
    const adminExists = await UserModel.findOne({ role: 'admin' });
    
    if (adminExists) {
      return NextResponse.json({ 
        error: 'Um usuário administrador já existe no sistema' 
      }, { status: 400 });
    }
    
    // Obter dados do corpo da requisição
    const body = await req.json();
    
    // Validar dados
    const result = setupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ 
        error: 'Dados inválidos', 
        details: result.error.format() 
      }, { status: 400 });
    }
    
    const { name, email, password } = result.data;
    
    // Verificar se o email já está em uso
    const emailExists = await UserModel.findOne({ email });
    if (emailExists) {
      return NextResponse.json({ 
        error: 'Este email já está em uso' 
      }, { status: 400 });
    }
    
    // Criar o usuário administrador
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });
    
    // Retornar sucesso (sem a senha)
    return NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    return NextResponse.json({ 
      error: 'Erro ao criar usuário administrador' 
    }, { status: 500 });
  }
}
