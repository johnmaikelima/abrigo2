const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Administrador';

async function addAdminUser() {
  console.log('Iniciando processo de adição de usuário administrador...');
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB');
    
    const db = client.db('blog-admin');
    const usersCollection = db.collection('users');
    
    // Verificar se o usuário já existe
    const existingUser = await usersCollection.findOne({ email: ADMIN_EMAIL });
    
    if (existingUser) {
      console.log(`ℹ️  Usuário com o email ${ADMIN_EMAIL} já existe`);
      return;
    }
    
    // Criar hash da senha
    console.log('Criando hash da senha...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, saltRounds);
    
    // Criar o usuário administrador
    const adminUser = {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    console.log('Adicionando usuário administrador...');
    const result = await usersCollection.insertOne(adminUser);
    
    if (result.acknowledged) {
      console.log('✅ Usuário administrador criado com sucesso!');
      console.log('📧 Email:', ADMIN_EMAIL);
      console.log('🔑 Senha:', ADMIN_PASSWORD);
      console.log('⚠️  Lembre-se de alterar a senha após o primeiro login!');
    } else {
      console.log('❌ Falha ao criar usuário administrador');
    }
    
  } catch (error) {
    console.error('❌ Erro ao adicionar usuário administrador:', error);
  } finally {
    await client.close();
    console.log('Conexão encerrada');
  }
}

// Executar a função principal
addAdminUser();
