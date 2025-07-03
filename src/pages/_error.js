import React from 'react';

function Error({ statusCode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        {statusCode ? `Erro ${statusCode}` : 'Erro no Cliente'}
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        {statusCode
          ? `Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.`
          : 'Ocorreu um erro no cliente. Por favor, tente novamente.'}
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
  );
}

// Este método é executado no servidor para páginas com getServerSideProps
// e no cliente para páginas com getInitialProps
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  // Removemos skipAppRender pois pode causar problemas no Next.js 14
  return { statusCode };
};

export default Error;
