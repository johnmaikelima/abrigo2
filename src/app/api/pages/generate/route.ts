import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '@/app/api/users/middleware';
import OpenAI from 'openai';

// Configuração da API da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AIOptions {
  model: string;
  maxTokens: number;
  featuresCount: number;
  testimonialsCount: number;
  ctaLink: string;
  temperature: number;
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      // Verificar se a chave da API está configurada
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: 'API key da OpenAI não configurada' },
          { status: 500 }
        );
      }

      const { title, prompt, options } = await req.json();
      
      // Opções padrão caso não sejam fornecidas
      const aiOptions: AIOptions = options || {
        model: 'gpt-3.5-turbo',
        maxTokens: 2500,
        featuresCount: 3,
        testimonialsCount: 2,
        ctaLink: '#contato',
        temperature: 0.7
      };

      if (!title || !prompt) {
        return NextResponse.json(
          { error: 'Título e prompt são obrigatórios' },
          { status: 400 }
        );
      }

      // Construir o prompt para a API da OpenAI com base nas opções avançadas
      const fullPrompt = `
Crie uma página web completa sobre "${title}".

${prompt}

Retorne apenas o conteúdo em formato JSON com a seguinte estrutura:
{
  "sections": [
    {
      "type": "hero",
      "title": "Título principal",
      "subtitle": "Subtítulo ou slogan",
      "content": "Breve descrição em formato HTML com tags básicas como <p>, <strong>, <em>, etc.",
      "buttonText": "Texto do botão",
      "buttonLink": "${aiOptions.ctaLink}",
      "backgroundColor": "#cor-em-hex",
      "textColor": "#cor-em-hex",
      "imageUrl": "URL de uma imagem de fundo (opcional)"
    },
    {
      "type": "features",
      "title": "Recursos ou Serviços",
      "subtitle": "Subtítulo da seção",
      "items": [
        // Aqui você deve criar exatamente ${aiOptions.featuresCount} itens de recursos
        // Exemplo para cada item:
        {
          "title": "Nome do recurso",
          "content": "Descrição do recurso em HTML",
          "icon": "nome-do-icone" // Use nomes de ícones como: check, settings, users, star, etc.
        }
      ]
    },
    {
      "type": "content",
      "title": "Seção de conteúdo",
      "content": "Conteúdo detalhado em formato HTML com parágrafos, listas, destaques, etc. Use tags como <p>, <ul>, <li>, <h3>, <strong>, <em>, etc."
    },
    {
      "type": "testimonials",
      "title": "Depoimentos",
      "items": [
        // Aqui você deve criar exatamente ${aiOptions.testimonialsCount} itens de depoimentos
        // Exemplo para cada item:
        {
          "content": "Texto do depoimento em HTML",
          "title": "Nome da pessoa",
          "subtitle": "Cargo/Empresa"
        }
      ]
    },
    {
      "type": "cta",
      "title": "Chamada para ação",
      "content": "Texto persuasivo em HTML",
      "buttonText": "Texto do botão",
      "buttonLink": "${aiOptions.ctaLink}"
    }
  ],
  "metaTags": {
    "description": "Meta descrição para SEO",
    "keywords": "palavras-chave,separadas,por,virgula"
  }
}

IMPORTANTE: 
1. Todo o conteúdo textual deve estar em formato HTML com tags apropriadas para formatação. Não use markdown.
2. Crie exatamente ${aiOptions.featuresCount} itens na seção de features.
3. Crie exatamente ${aiOptions.testimonialsCount} itens na seção de depoimentos.
4. Use o link "${aiOptions.ctaLink}" para todos os botões de chamada à ação.
5. Use nomes de ícones comuns como: check, settings, users, star, heart, mail, etc.
`;

      // Fazer a chamada para a API da OpenAI com as opções personalizadas
      const response = await openai.chat.completions.create({
        model: aiOptions.model,
        messages: [
          {
            role: "system",
            content: "Você é um especialista em criação de conteúdo para sites. Crie conteúdo profissional, persuasivo e otimizado para SEO."
          },
          {
            role: "user",
            content: fullPrompt
          }
        ],
        temperature: aiOptions.temperature,
        max_tokens: aiOptions.maxTokens,
      });

      // Extrair e processar a resposta
      const content = response.choices[0]?.message?.content || '';
      
      try {
        // Tentar extrair o JSON da resposta
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonContent = jsonMatch ? jsonMatch[0] : '';
        const parsedContent = JSON.parse(jsonContent);
        
        return NextResponse.json(parsedContent);
      } catch (parseError) {
        console.error('Erro ao processar resposta da IA:', parseError);
        return NextResponse.json(
          { 
            error: 'Erro ao processar resposta da IA',
            rawContent: content 
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('Erro ao gerar conteúdo com IA:', error);
      return NextResponse.json(
        { error: 'Erro ao gerar conteúdo com IA' },
        { status: 500 }
      );
    }
  });
}
