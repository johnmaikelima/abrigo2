import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // Resolver o problema de renderização das páginas de erro
    const initialProps = await Document.getInitialProps(ctx);
    
    // Verificar se estamos em uma página de erro
    const isErrorPage = ctx.pathname === '/404' || ctx.pathname === '/500' || ctx.pathname === '/_error';
    
    return { 
      ...initialProps,
      isErrorPage 
    };
  }

  render() {
    return (
      <Html lang="pt-BR">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* Evitar qualquer script ou código que possa causar problemas em páginas de erro */}
          {!this.props.isErrorPage && (
            <>
              {/* Scripts adicionais apenas para páginas normais */}
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
