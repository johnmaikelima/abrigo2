require('dotenv').config({ path: '../.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { UserModel } = require('../dist/models');

// Registrar os modelos
require('../dist/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';

async function createAdminUser() {
  try {
    console.log('Conectando ao MongoDB...');
    
    // Configuração do Mongoose
    mongoose.set('strictQuery', true);
    
    // Conectar ao MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Verificar se já existe um usuário administrador
    const existingAdmin = await UserModel.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Usuário administrador já existe');
      console.log('Email:', existingAdmin.email);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Criar um hash da senha
    console.log('Criando hash da senha...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Criar o usuário administrador
    const adminUser = {
      name: 'Administrador',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    };

    console.log('Criando usuário administrador...');
    await UserModel.create(adminUser);
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Senha: admin123');
    
    // Desconectar do MongoDB
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:');
    console.error(error);
    
    // Tentar desconectar em caso de erro
    try {
      await mongoose.disconnect();
    } catch (e) {
      console.error('Erro ao desconectar do MongoDB:', e);
    }
    
    process.exit(1);
  }
}

// Executar a função principal
createAdminUser();
