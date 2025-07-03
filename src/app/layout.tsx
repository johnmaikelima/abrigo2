import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';
import { processHtmlForServerRendering } from '@/lib/html-utils';
import { ServerHtmlHead } from '@/components/server-html-head';
import { ServerHtmlBody } from '@/components/server-html-body';

// Interface para tipar as configurações do blog
interface BlogSettings {
  name?: string;
  description?: string;
  customHtml?: {
    head?: string;
    body?: string;
  };
}

// Buscar configurações do blog para usar como metadata
export async function generateMetadata(): Promise<Metadata> {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Buscar configurações do blog
    const settingsDoc = await BlogSettingsModel.findOne().lean();
    
    // Se encontrou configurações, usar o nome do blog como título padrão
    if (settingsDoc) {
      // Converter para o tipo BlogSettings
      const settings: BlogSettings = settingsDoc as unknown as BlogSettings;
      
      return {
        metadataBase: new URL('http://localhost:3000'),
        title: {
          template: '%s',
          default: settings.name || 'Altustec'
        },
        description: settings.description || 'Manutenção de Notebook com a Altustec',
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
async function getBlogSettings(): Promise<BlogSettings> {
  try {
    await connectToDatabase();
    const settingsDoc = await BlogSettingsModel.findOne().lean();
    if (!settingsDoc) return { customHtml: { head: '', body: '' } };
    
    // Converter para o tipo BlogSettings
    return serializeMongoDBObject(settingsDoc) as BlogSettings;
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
  
  // Não vamos mais processar o HTML personalizado no servidor
  // Isso será feito apenas no cliente para evitar erros de hidratação
  
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Não renderizamos nada personalizado no head durante SSR */}
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
            
            {/* Script para injetar HTML personalizado após a hidratação */}
            <Script
              id="inject-custom-html"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function() {
                    // Função para injetar HTML personalizado após a hidratação
                    const customHead = ${JSON.stringify(settings?.customHtml?.head || '')};
                    const customBody = ${JSON.stringify(settings?.customHtml?.body || '')};
                    
                    // Injetar HTML no head
                    if (customHead) {
                      const headFragment = document.createRange().createContextualFragment(customHead);
                      document.head.appendChild(headFragment);
                    }
                    
                    // Injetar HTML no body
                    if (customBody) {
                      const bodyDiv = document.createElement('div');
                      bodyDiv.id = 'custom-body-elements';
                      bodyDiv.innerHTML = customBody;
                      document.body.appendChild(bodyDiv);
                    }
                  })();
                `
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
