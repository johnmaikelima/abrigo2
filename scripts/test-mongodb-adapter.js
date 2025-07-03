const { MongoDBAdapter } = require('@auth/mongodb-adapter');
const clientPromise = require('../src/lib/mongodb');

async function testAdapter() {
  console.log('Testando MongoDB Adapter...');
  
  try {
    const adapter = MongoDBAdapter(clientPromise, {
      databaseName: 'blog-admin',
    });
    
    console.log('Adapter criado com sucesso');
    
    // Testar a conexão com o banco de dados
    const client = await clientPromise;
    await client.connect();
    console.log('Conectado ao MongoDB');
    
    // Verificar se a coleção de usuários existe
    const db = client.db('blog-admin');
    const collections = await db.listCollections().toArray();
    console.log('Coleções no banco de dados:');
    console.log(collections.map(c => c.name));
    
    // Verificar se há usuários na coleção
    const users = await db.collection('users').find({}).toArray();
    console.log('Total de usuários:', users.length);
    
    if (users.length > 0) {
      console.log('Primeiro usuário:', {
        id: users[0]._id,
        email: users[0].email,
        name: users[0].name,
        role: users[0].role,
      });
    }
    
    console.log('Teste concluído com sucesso!');
    
  } catch (error) {
    console.error('Erro ao testar MongoDB Adapter:', error);
  } finally {
    process.exit(0);
  }
}

testAdapter();
