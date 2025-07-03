# Configuração do ImageKit para Upload de Imagens

Este projeto utiliza o ImageKit.io para armazenamento e entrega de imagens. Siga as instruções abaixo para configurar corretamente o upload de imagens em ambientes de desenvolvimento e produção.

## Configuração de Variáveis de Ambiente

1. Adicione as seguintes variáveis ao seu arquivo `.env.local` para desenvolvimento local:

```
IMAGEKIT_PUBLIC_KEY="sua_chave_publica_aqui"
IMAGEKIT_PRIVATE_KEY="sua_chave_privada_aqui"
IMAGEKIT_URL_ENDPOINT="seu_url_endpoint_aqui"
```

**IMPORTANTE: Nunca compartilhe suas chaves privadas em repositórios públicos ou documentação!**

2. No ambiente de produção (Vercel), adicione as mesmas variáveis nas configurações do projeto:
   - Vá para o dashboard do Vercel
   - Selecione seu projeto
   - Navegue até "Settings" > "Environment Variables"
   - Adicione as mesmas variáveis acima

## Como o Upload de Imagens Funciona

1. O componente `ImageUpload` envia a imagem para a rota `/api/upload`
2. A API converte a imagem em um buffer e a envia para o ImageKit.io
3. O ImageKit armazena a imagem e retorna uma URL pública
4. A URL é armazenada no banco de dados e usada para exibir a imagem

## Pastas no ImageKit

As imagens são organizadas em pastas no ImageKit de acordo com seu tipo:
- `/logos` - Para logos do site
- `/favicons` - Para favicons
- `/posts` - Para imagens de posts
- `/uploads` - Para uploads gerais

## Solução de Problemas

Se você encontrar erros de upload:

1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Confirme se a chave privada do ImageKit está completa e correta
3. Verifique os logs do console para mensagens de erro detalhadas
4. Certifique-se de que o tamanho da imagem não excede 2MB

## Recursos Adicionais

- [Documentação do ImageKit](https://docs.imagekit.io/)
- [Painel de controle do ImageKit](https://imagekit.io/dashboard)
