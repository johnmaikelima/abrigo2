import { connectToDatabase } from '../lib/mongoose';
import { UserModel } from '../models/User';
import bcrypt from 'bcryptjs';

async function createAdminUser() {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Verificar se já existe algum usuário admin
    const adminExists = await UserModel.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Um usuário administrador já existe:', adminExists.email);
      return;
    }
    
    // Dados do admin
    const adminData = {
      name: 'Administrador',
      email: 'admin@exemplo.com',
      password: await bcrypt.hash('senha123', 10), // Substitua por uma senha segura
      role: 'admin',
    };
    
    // Criar o usuário admin
    const admin = await UserModel.create(adminData);
    
    console.log('Usuário administrador criado com sucesso:');
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
    
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
  } finally {
    // Desconectar do banco de dados
    process.exit(0);
  }
}

// Executar a função
createAdminUser();
