const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';

async function testConnection() {
  console.log('Testando conexão com o MongoDB...');
  console.log('String de conexão:', MONGODB_URI);
  
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado com sucesso ao MongoDB');
    
    console.log('Listando bancos de dados...');
    const adminDb = client.db('admin');
    const databases = await adminDb.admin().listDatabases();
    console.log('Bancos de dados disponíveis:', databases.databases.map(db => db.name));
    
    console.log('Testando conexão com o banco de dados...');
    const db = client.db('blog-admin');
    const collections = await db.listCollections().toArray();
    console.log('Coleções no banco de dados:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  } finally {
    await client.close();
    console.log('Conexão encerrada');
  }
}

testConnection();
