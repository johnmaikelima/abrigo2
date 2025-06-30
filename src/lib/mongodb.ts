import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

const uri = process.env.MONGODB_URI;
console.log('🔵 Conectando ao MongoDB...');
console.log('🔵 URI do MongoDB:', uri?.replace(/mongodb:\/\/([^:]+):([^@]+)@/, 'mongodb://***:***@'));

const options = {
  serverSelectionTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 45000, // 45 segundos
  connectTimeoutMS: 30000, // 30 segundos
  maxPoolSize: 10, // Número máximo de conexões no pool
  minPoolSize: 1, // Número mínimo de conexões no pool
  maxIdleTimeMS: 10000, // Tempo máximo que uma conexão pode ficar ociosa no pool
  retryWrites: true,
  w: 'majority' as const,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, use uma variável global para evitar múltiplas conexões
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log('🔵 Nova conexão com o MongoDB criada');
  } else {
    console.log('🔵 Usando conexão existente com o MongoDB');
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Em produção, evite usar uma variável global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log('🔵 Conexão de produção com o MongoDB criada');
}

export default clientPromise;

// Função para conectar ao banco de dados
export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db();
  return { client, db };
}
