import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';
import { UserModel } from '@/models/User';
import { connectToDatabase } from './mongoose';
import bcrypt from 'bcryptjs';
import { JWT } from 'next-auth/jwt';

// Configuração do adaptador MongoDB
const adapter = MongoDBAdapter(clientPromise, {
  databaseName: 'blog-admin',
}) as any; // Usando 'as any' temporariamente para evitar erros de tipo

export const authOptions: AuthOptions = {
  debug: true, // Habilitar logs de depuração
  adapter,
  logger: {
    error(code, metadata) {
      console.error('🔴 NextAuth Error:', { code, metadata });
    },
    warn(code) {
      console.warn('🟠 NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('🔵 NextAuth Debug:', { code, metadata });
    },
  },
  events: {
    async signIn(message) {
      console.log('🔑 Usuário fez login:', message);
    },
    async signOut(message) {
      console.log('🚪 Usuário fez logout:', message);
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Tentativa de login com:', { email: credentials?.email });
        
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais faltando');
          throw new Error('Por favor, preencha todos os campos');
        }

        try {
          // Conectar ao banco de dados
          await connectToDatabase();
          
          // Encontrar o usuário pelo email
          console.log('Buscando usuário no banco de dados...');
          const user = await UserModel.findOne({ email: credentials.email })
            .select('+password') // Garante que o campo password seja retornado
            .lean();
          
          if (!user) {
            console.log('Usuário não encontrado');
            throw new Error('Email ou senha inválidos');
          }

          console.log('Usuário encontrado:', { id: user._id, email: user.email });
          console.log('Verificando senha...');
          
          // Verificar a senha
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.log('Senha inválida');
            throw new Error('Email ou senha inválidos');
          }

          console.log('Login bem-sucedido para o usuário:', user.email);
          
          // Retornar o objeto do usuário sem a senha
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch (error) {
          console.error('Erro durante a autenticação:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Adicionar role ao token JWT
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar role à sessão
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
