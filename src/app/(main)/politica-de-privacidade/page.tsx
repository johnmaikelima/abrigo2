import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import { Metadata } from 'next';

// Função para gerar metadados dinâmicos para a página
export async function generateMetadata(): Promise<Metadata> {
  // Buscar configurações do blog
  await connectToDatabase();
  const settingsDoc = await BlogSettingsModel.findOne().lean();
  
  // Definir valores padrão ou usar os valores do banco de dados
  const settings = {
    name: settingsDoc?.name || 'Blog Moderno',
    description: settingsDoc?.description || 'Um blog sobre tecnologia e desenvolvimento web'
  };
  
  return {
    title: `Política de Privacidade | ${settings.name}`,
    description: `Política de Privacidade do ${settings.name}. Saiba como tratamos seus dados.`,
  };
}

export default async function PrivacyPolicyPage() {
  // Buscar configurações do blog
  await connectToDatabase();
  const settingsDoc = await BlogSettingsModel.findOne().lean();
  
  // Definir valores padrão ou usar os valores do banco de dados
  const blogName = settingsDoc?.name || 'Blog Moderno';
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 leading-tight">
          Política de Privacidade
        </h1>

        <div className="bg-white rounded-lg p-8 shadow-sm leading-relaxed text-lg">
          <p className="mb-6">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>

          <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
          <p className="mb-6">
            Bem-vindo à Política de Privacidade do {blogName}. Esta política descreve como coletamos, 
            usamos e protegemos suas informações pessoais quando você visita nosso site.
          </p>

          <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
          <p className="mb-4">
            Podemos coletar os seguintes tipos de informações:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Informações de identificação pessoal</strong>: como nome, endereço de e-mail, 
              quando você se registra em nosso site, assina nossa newsletter ou entra em contato conosco.
            </li>
            <li>
              <strong>Informações de uso</strong>: como seu endereço IP, tipo de navegador, páginas 
              visitadas e tempo gasto em nosso site.
            </li>
            <li>
              <strong>Cookies e tecnologias semelhantes</strong>: usamos cookies para melhorar sua 
              experiência em nosso site e analisar como ele é usado.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
          <p className="mb-4">
            Usamos suas informações para:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Fornecer, manter e melhorar nosso site e serviços</li>
            <li>Responder a suas perguntas e solicitações</li>
            <li>Enviar newsletters e comunicações de marketing (se você optou por recebê-las)</li>
            <li>Analisar como nosso site é usado para melhorar a experiência do usuário</li>
            <li>Cumprir obrigações legais</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Informações</h2>
          <p className="mb-6">
            Não vendemos suas informações pessoais a terceiros. Podemos compartilhar suas informações com:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Provedores de serviços que nos ajudam a operar nosso site</li>
            <li>Autoridades legais quando exigido por lei</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">5. Segurança</h2>
          <p className="mb-6">
            Implementamos medidas de segurança para proteger suas informações contra acesso não autorizado, 
            alteração, divulgação ou destruição.
          </p>

          <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos</h2>
          <p className="mb-6">
            Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Para exercer 
            esses direitos, entre em contato conosco através das informações fornecidas abaixo.
          </p>

          <h2 className="text-2xl font-semibold mb-4">7. Alterações nesta Política</h2>
          <p className="mb-6">
            Podemos atualizar esta política de privacidade periodicamente. A versão mais recente 
            estará sempre disponível em nosso site.
          </p>

          <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
          <p className="mb-6">
            Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco através 
            das informações disponíveis em nossa página de contato.
          </p>

          <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500">
            <p>© {currentYear} {blogName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
