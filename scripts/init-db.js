const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

console.log('Variáveis de ambiente carregadas:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***' : 'Não definida');

// Modelo de usuário
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'author'],
    default: 'author',
  },
}, {
  timestamps: true,
});


const User = mongoose.models.User || mongoose.model('User', userSchema);

// Função para conectar ao MongoDB
async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-admin';
    
    console.log('Conectando ao MongoDB...');
    mongoose.set('strictQuery', true);
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
}

// Função para criar o usuário admin
async function createAdminUser() {
  try {
    await connectDB();
    
    // Verificar se já existe um usuário administrador
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Usuário administrador já existe');
      console.log('Email:', existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    // Criar um hash da senha
    console.log('Criando hash da senha...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Criar o usuário administrador
    const adminUser = new User({
      name: 'Administrador',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Criando usuário administrador...');
    await adminUser.save();
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('📧 Email: admin@example.com');
    console.log('🔑 Senha: admin123');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
  } finally {
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  }
}

// Executar a função principal
createAdminUser();
