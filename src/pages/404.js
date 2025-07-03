import React from 'react';
import Link from 'next/link';
import Document, { Html, Head, Main, NextScript } from 'next/document';

// Página de erro 404 personalizada que não usa hooks ou APIs do navegador
function Custom404() {
  return (
    <Html>
      <Head>
        <title>404 - Página Não Encontrada</title>
      </Head>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Página Não Encontrada</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            A página que você está procurando não existe ou foi movida.
          </p>
          <a href="/" style={{
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}>
            Voltar para a página inicial
          </a>
        </div>
      </body>
    </Html>
  );
}

// Next.js não permite getInitialProps em páginas de erro
// Usamos uma abordagem estática para esta página

export default Custom404;
