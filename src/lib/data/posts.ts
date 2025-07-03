// Tipos para os posts
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    email: string;
  };
  tags: string[];
  category: string;
  categoryName?: string;
  coverImage?: string;
}

// Dados de exemplo para posts (em produção, isso viria do banco de dados)
export const posts: Post[] = [
  {
    id: '1',
    title: 'Introdução ao Next.js',
    slug: 'introducao-ao-nextjs',
    content: 'Next.js é um framework React que permite funcionalidades como renderização do lado do servidor e geração de sites estáticos para aplicativos da web baseados em React. É um framework pronto para produção que vem com todas as funcionalidades que você precisa para criar aplicativos React de alta qualidade.',
    excerpt: 'Aprenda os conceitos básicos do Next.js e como criar aplicações web modernas.',
    published: true,
    publishedAt: new Date('2025-06-10').toISOString(),
    createdAt: new Date('2025-06-05').toISOString(),
    updatedAt: new Date('2025-06-05').toISOString(),
    author: {
      name: 'João Silva',
      email: 'joao@example.com',
    },
    tags: ['Next.js', 'React', 'JavaScript'],
    category: 'Desenvolvimento Web',
  },
  {
    id: '2',
    title: 'Estilizando com Tailwind CSS',
    slug: 'estilizando-com-tailwind-css',
    content: 'Tailwind CSS é um framework CSS utilitário de baixo nível que permite construir designs personalizados sem sair do seu HTML. Ao contrário de outros frameworks CSS como Bootstrap ou Material UI, o Tailwind não vem com componentes pré-construídos, mas com classes utilitárias que você pode combinar para criar seus próprios designs.',
    excerpt: 'Descubra como o Tailwind CSS pode acelerar o desenvolvimento de interfaces.',
    published: true,
    publishedAt: new Date('2025-06-12').toISOString(),
    createdAt: new Date('2025-06-08').toISOString(),
    updatedAt: new Date('2025-06-08').toISOString(),
    author: {
      name: 'Maria Oliveira',
      email: 'maria@example.com',
    },
    tags: ['CSS', 'Tailwind', 'Design'],
    category: 'Design',
  },
  {
    id: '3',
    title: 'MongoDB e Next.js',
    slug: 'mongodb-e-nextjs',
    content: 'MongoDB é um banco de dados NoSQL orientado a documentos que armazena dados em documentos semelhantes a JSON. Quando combinado com Next.js, você pode criar aplicações full-stack poderosas com uma API integrada.',
    excerpt: 'Integrando MongoDB com aplicações Next.js para criar blogs dinâmicos.',
    published: false,
    createdAt: new Date('2025-06-14').toISOString(),
    updatedAt: new Date('2025-06-14').toISOString(),
    author: {
      name: 'Pedro Santos',
      email: 'pedro@example.com',
    },
    tags: ['MongoDB', 'Next.js', 'Database'],
    category: 'Backend',
  },
];

// Funções de API simuladas

// Obter todos os posts (com opção de filtrar apenas publicados)
export async function getPosts(onlyPublished = false) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (onlyPublished) {
    return posts.filter(post => post.published);
  }
  
  return posts;
}

// Obter um post específico pelo slug
export async function getPostBySlug(slug: string) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return posts.find(post => post.slug === slug) || null;
}

// Obter um post específico pelo ID
export async function getPostById(id: string) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return posts.find(post => post.id === id) || null;
}

// Adicionar um novo post (simulado)
export async function addPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newPost: Post = {
    ...post,
    id: `${posts.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  posts.push(newPost);
  return newPost;
}

// Atualizar um post existente (simulado)
export async function updatePost(id: string, postData: Partial<Post>) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    throw new Error('Post não encontrado');
  }
  
  posts[index] = {
    ...posts[index],
    ...postData,
    updatedAt: new Date().toISOString(),
  };
  
  return posts[index];
}

// Excluir um post (simulado)
export async function deletePost(id: string) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    throw new Error('Post não encontrado');
  }
  
  const deletedPost = posts[index];
  posts.splice(index, 1);
  
  return deletedPost;
}
