import { MongoClient } from 'mongodb';

// Carrega as variáveis de ambiente do .env.local
require('dotenv').config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI no arquivo .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {
  // Opções adicionais do MongoDB podem ser adicionadas aqui
  // Exemplo: useNewUrlParser: true,
};

// Verifica se o NODE_ENV está definido, caso contrário, assume 'development'
const isDevelopment = process.env.NODE_ENV !== 'production';

// Declaração para evitar erros de tipo no TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (isDevelopment) {
  // Em desenvolvimento, use uma variável global para evitar múltiplas conexões
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  // Em produção, evite usar uma variável global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Exportação do cliente do MongoDB
export default clientPromise;
