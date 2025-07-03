import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';

async function listUsers() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Conectando ao MongoDB...');
    await client.connect();
    console.log('✅ Conectado ao MongoDB');
    
    const db = client.db('blog-admin');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('\nUsuários encontrados:');
    console.log('-------------------');
    
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado.');
      return;
    }
    
    users.forEach((user, index) => {
      console.log(`\nUsuário #${index + 1}:`);
      console.log('ID:', user._id);
      console.log('Nome:', user.name);
      console.log('Email:', user.email);
      console.log('Função:', user.role);
      console.log('Criado em:', user.createdAt);
      console.log('Atualizado em:', user.updatedAt);
      console.log('Hash da senha:', user.password ? '***' : 'Não definida');
    });
    
    console.log('\nTotal de usuários:', users.length);
    
  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
  } finally {
    await client.close();
    console.log('\nConexão encerrada');
  }
}

// Executar a função principal
listUsers();
