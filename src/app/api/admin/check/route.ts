import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { UserModel } from '@/models/User';

export async function GET() {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Verificar se existe algum usuário administrador
    const adminExists = await UserModel.findOne({ role: 'admin' });
    
    // Retornar o resultado
    return NextResponse.json({ 
      hasAdmin: !!adminExists,
    }, { status: 200 });
    
  } catch (error) {
    console.error('Erro ao verificar administrador:', error);
    return NextResponse.json({ 
      error: 'Erro ao verificar administrador' 
    }, { status: 500 });
  }
}
