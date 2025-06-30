<<<<<<< HEAD
# Painel Administrativo para Blog

Este é um painel administrativo moderno para gerenciamento de blog, construído com Next.js, TypeScript, Tailwind CSS e MongoDB.

## Recursos

- Interface de usuário responsiva e moderna
- Tema claro/escuro
- Painel de controle com estatísticas
- Gerenciamento de artigos
- Gerenciamento de categorias
- Geração de conteúdo com IA
- Estatísticas de visualização
- Configurações do site
- Autenticação segura
- Otimizado para SEO

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) - Framework React
- [TypeScript](https://www.typescriptlang.org/) - Tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [MongoDB](https://www.mongodb.com/) - Banco de dados
- [NextAuth.js](https://next-auth.js.org/) - Autenticação
- [React Hook Form](https://react-hook-form.com/) - Gerenciamento de formulários
- [Zod](https://zod.dev/) - Validação de esquema
- [Lucide Icons](https://lucide.dev/) - Ícones

## Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone [URL_DO_REPOSITORIO]
   cd estrutura-blog
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
   ```
   MONGODB_URI=sua_url_de_conexao_mongodb
   NEXTAUTH_SECRET=seu_segredo_secreto
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura de Pastas

```
src/
├── app/                    # Rotas da aplicação
│   ├── api/                # Rotas da API
│   ├── dashboard/          # Páginas do painel administrativo
│   ├── login/              # Página de login
│   └── layout.tsx          # Layout raiz
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes de UI
│   └── sidebar.tsx         # Barra lateral
├── lib/                    # Utilitários e configurações
│   ├── db.ts               # Conexão com o MongoDB
│   └── auth.ts             # Configuração de autenticação
└── types/                  # Tipos TypeScript
```

## Variáveis de Ambiente

| Variável              | Obrigatório | Descrição                                      |
|-----------------------|-------------|-----------------------------------------------|
| `MONGODB_URI`        | Sim         | URL de conexão com o MongoDB                   |
| `NEXTAUTH_SECRET`     | Sim         | Segredo para criptografia de sessão           |
| `NEXTAUTH_URL`        | Sim         | URL base da aplicação (ex: http://localhost:3000) |

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói a aplicação para produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o ESLint
- `npm run format` - Formata o código com Prettier

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
=======
# blog2
>>>>>>> 515e9ef2fde70c82ce4b89a13deb19e4493ff383
