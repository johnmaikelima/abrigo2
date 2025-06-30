import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';
import { processHtmlForServerRendering } from '@/lib/html-utils';
import { ServerHtmlHead } from '@/components/server-html-head';
import { ServerHtmlBody } from '@/components/server-html-body';

// Buscar configurações do blog para usar como metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Buscar configurações do blog
    const settings = await BlogSettingsModel.findOne().lean();
    
    // Se encontrou configurações, usar o nome do blog como título padrão
    if (settings) {
      return {
        metadataBase: new URL('http://localhost:3000'),
        title: {
          template: '%s',
          default: settings.name as string || 'Altustec'
        },
        description: settings.description as string || 'Manutenção de Notebook com a Altustec',
      };
    }
  } catch (error) {
    console.error('Erro ao buscar configurações do blog para metadata:', error);
  }
  
  // Fallback para caso de erro ou se não encontrar configurações
  return {
    metadataBase: new URL('http://localhost:3000'),
    title: {
      template: '%s',
      default: 'ALTUS'
    },
    description: 'Manutenção de Notebook com a Altustec',
  };
}

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Função para buscar configurações do blog incluindo HTML personalizado
async function getBlogSettings() {
  try {
    await connectToDatabase();
    const settings = await BlogSettingsModel.findOne().lean();
    if (!settings) return { customHtml: { head: '', body: '' } };
    
    return serializeMongoDBObject(settings);
  } catch (error) {
    console.error('Erro ao buscar configurações de HTML personalizado:', error);
    return { customHtml: { head: '', body: '' } };
  }
}

// Função para extrair meta tags e outros elementos estáticos do HTML personalizado
// Agora usando a função da biblioteca html-utils

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Buscar configurações do blog incluindo HTML personalizado
  const settings = await getBlogSettings();
  
  const customHead = settings?.customHtml?.head || '';
  const customBody = settings?.customHtml?.body || '';
  
  // Processar o HTML personalizado para renderização no servidor
  const { metaTags: headMetaTags, scripts: headScripts } = processHtmlForServerRendering(customHead);
  const { scripts: bodyScripts, otherElements: bodyElements } = processHtmlForServerRendering(customBody);
  
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Injetar meta tags e scripts do HTML personalizado */}
        {customHead && (
          <>
            {/* Marcador para indicar que há HTML personalizado */}
            <meta name="custom-html" content="true" />
            {/* Renderizar HTML personalizado no head */}
            <ServerHtmlHead metaTags={headMetaTags} scripts={headScripts} rawHtml={customHead} />
          </>
        )}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
            
            {/* Injetar HTML personalizado no final do body */}
            {customBody && (
              <ServerHtmlBody scripts={bodyScripts} otherElements={bodyElements} />
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
