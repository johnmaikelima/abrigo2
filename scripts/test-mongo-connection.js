const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';

async function testConnection() {
  console.log('🔵 Conectando ao MongoDB...');
  console.log('🔵 URI do MongoDB:', MONGODB_URI.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB com sucesso!');
    
    const db = client.db('blog-admin');
    const collections = await db.listCollections().toArray();
    console.log('📂 Coleções no banco de dados:');
    console.log(collections.map(c => c.name));
    
    const users = await db.collection('users').find({}).toArray();
    console.log(`👥 Total de usuários: ${users.length}`);
    
    if (users.length > 0) {
      console.log('📝 Primeiro usuário:');
      const { password, ...userWithoutPassword } = users[0];
      console.log(JSON.stringify(userWithoutPassword, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  } finally {
    await client.close();
    console.log('🔴 Conexão com o MongoDB fechada');
  }
}

testConnection();
