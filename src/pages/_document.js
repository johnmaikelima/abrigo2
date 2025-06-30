import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Remover qualquer título padrão que possa estar causando o problema */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Não definimos o título aqui, deixamos para o componente TitleHandler */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
