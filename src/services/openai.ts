import OpenAI from 'openai';

// Inicializa o cliente da OpenAI com a chave da API do ambiente
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Interface para o artigo gerado em massa
export interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
}

/**
 * Gera conteúdo usando o modelo GPT da OpenAI
 * @param prompt O prompt para gerar conteúdo
 * @param model O modelo a ser usado (padrão: gpt-4o)
 * @param maxTokens Número máximo de tokens na resposta
 * @returns O texto gerado
 */
export async function generateContent(
  prompt: string,
  model: string = 'gpt-4o',
  maxTokens: number = 1000
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente de redação para blog, especializado em criar conteúdo otimizado para SEO, envolvente e informativo.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content || '';
  } catch (error: any) {
    console.error('Erro ao gerar conteúdo com a OpenAI:', error);
    throw new Error(`Falha ao gerar conteúdo: ${error.message}`);
  }
}

/**
 * Gera um título otimizado para SEO usando o modelo GPT
 * @param topic O tópico para gerar o título
 * @returns O título gerado
 */
export async function generateSeoTitle(topic: string): Promise<string> {
  const prompt = `Crie um título otimizado para SEO sobre "${topic}". 
  O título deve ser atraente, conter palavras-chave relevantes e ter no máximo 60 caracteres.`;
  
  return generateContent(prompt, 'gpt-4o', 100);
}

/**
 * Gera uma meta descrição otimizada para SEO
 * @param topic O tópico para gerar a meta descrição
 * @returns A meta descrição gerada
 */
export async function generateSeoDescription(topic: string): Promise<string> {
  const prompt = `Crie uma meta descrição otimizada para SEO sobre "${topic}".
  A descrição deve ser informativa, conter palavras-chave relevantes e ter entre 150-160 caracteres.`;
  
  return generateContent(prompt, 'gpt-4o', 200);
}

/**
 * Gera um esboço de artigo com base em um tópico
 * @param topic O tópico do artigo
 * @returns O esboço do artigo
 */
export async function generateArticleOutline(topic: string): Promise<string> {
  const prompt = `Crie um esboço detalhado para um artigo de blog sobre "${topic}".
  Inclua uma introdução, pelo menos 3-5 seções principais com subtópicos, e uma conclusão.
  Estruture o esboço de forma clara com marcadores.`;
  
  return generateContent(prompt, 'gpt-4o', 500);
}

/**
 * Gera um artigo completo com base em um tópico e esboço
 * @param topic O tópico do artigo
 * @param outline O esboço do artigo (opcional)
 * @returns O artigo completo
 */
export async function generateFullArticle(topic: string, outline?: string): Promise<string> {
  let prompt = `Escreva um artigo de blog completo e detalhado sobre "${topic}".`;
  
  if (outline) {
    prompt += ` Siga este esboço: ${outline}`;
  } else {
    prompt += ` O artigo deve incluir uma introdução envolvente, pelo menos 3-5 seções principais bem desenvolvidas, e uma conclusão.`;
  }
  
  prompt += ` O conteúdo deve ser informativo, otimizado para SEO, e escrito em um tom conversacional.
  Inclua exemplos práticos, estatísticas relevantes quando apropriado, e dicas acionáveis.
  O artigo deve ter entre 800-1200 palavras.`;
  
  return generateContent(prompt, 'gpt-4o', 3000);
}

/**
 * Melhora um texto existente para SEO e legibilidade
 * @param content O conteúdo a ser melhorado
 * @returns O conteúdo melhorado
 */
export async function improveContent(content: string): Promise<string> {
  const prompt = `Melhore o seguinte texto para SEO e legibilidade, mantendo o significado original:
  
  "${content}"
  
  Faça as seguintes melhorias:
  1. Otimize para SEO com palavras-chave relevantes
  2. Melhore a clareza e fluidez
  3. Corrija quaisquer erros gramaticais ou de pontuação
  4. Torne o texto mais envolvente e persuasivo
  5. Mantenha um tom conversacional e profissional`;
  
  return generateContent(prompt, 'gpt-4o', content.length * 1.5);
}

/**
 * Função auxiliar para limpar marcadores Markdown do JSON
 * @param jsonString String JSON potencialmente com marcadores Markdown
 * @returns String JSON limpa
 */
function cleanJsonResponse(jsonString: string): string {
  // Remove blocos de código Markdown ```json ... ```
  let cleaned = jsonString.replace(/```(json)?([\s\S]*?)```/g, '$2');
  
  // Remove espaços em branco no início e fim
  cleaned = cleaned.trim();
  
  // Garante que o JSON começa com { e termina com }
  if (!cleaned.startsWith('{')) {
    const startIndex = cleaned.indexOf('{');
    if (startIndex !== -1) {
      cleaned = cleaned.substring(startIndex);
    }
  }
  
  if (!cleaned.endsWith('}')) {
    const endIndex = cleaned.lastIndexOf('}');
    if (endIndex !== -1) {
      cleaned = cleaned.substring(0, endIndex + 1);
    }
  }
  
  return cleaned;
}

/**
 * Gera um artigo completo a partir de palavras-chave
 * @param keywords Palavras-chave para o artigo
 * @param category Categoria do artigo
 * @param charCount Quantidade aproximada de caracteres
 * @param customPrompt Prompt personalizado para geração
 * @returns Objeto com título, resumo, conteúdo, categoria e tags
 */
export async function generateBulkArticle(
  keywords: string,
  category: string,
  charCount: number = 3000,
  customPrompt: string = ''
): Promise<GeneratedArticle> {
  let prompt = `Crie um artigo completo de blog baseado nas seguintes palavras-chave: "${keywords}".
  
  O artigo deve ter aproximadamente ${charCount} caracteres e pertencer à categoria "${category}".
  
  `;
  
  if (customPrompt) {
    // Substituir vários marcadores possíveis pelas palavras-chave fornecidas
    let processedPrompt = customPrompt;
    const mainKeyword = keywords.split(',')[0].trim();
    
    // Substituir diferentes variações de marcadores
    const markers = [
      '{palavra-chave}',
      '{palavrachave}',
      '{keyword}',
      '{keywords}',
      '{palavra_chave}'
    ];
    
    markers.forEach(marker => {
      processedPrompt = processedPrompt.replace(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), mainKeyword);
    });
    
    prompt += `Siga estas instruções específicas: ${processedPrompt}\n\n`;
  } else {
    prompt += `Siga estas instruções para o artigo:
    - Linguagem simples e natural, como se fosse uma conversa com o leitor.
    - Estrutura bem organizada com subtítulos usando heading tags (h2 e h3).
    - Palavra-chave principal: ${keywords.split(',')[0]}
    - Uso de variações semânticas e termos relacionados à palavra-chave.
    - Abertura com uma pergunta ou situação comum do dia a dia, que envolva o leitor.
    - Explicações claras e conteúdo útil, com exemplos práticos sempre que possível.
    - Inclusão de benefícios, problemas resolvidos e/ou erros comuns relacionados ao tema.
    - Final com uma chamada para ação (CTA) encorajando o leitor a agir.
    `;
  }
  
  prompt += `
  
  Formate a resposta em JSON com os seguintes campos:
  {
    "title": "Título otimizado para SEO e atrativo",
    "excerpt": "Meta descrição de até 160 caracteres otimizada para SEO",
    "content": "Conteúdo completo do artigo em HTML",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  }
  `;
  
  const jsonResponse = await generateContent(prompt, 'gpt-4o', Math.max(charCount * 2, 4000));
  
  try {
    // Limpar a resposta de marcadores Markdown antes de fazer o parse
    const cleanedJsonResponse = cleanJsonResponse(jsonResponse);
    console.log('JSON limpo:', cleanedJsonResponse.substring(0, 100) + '...');
    
    const parsedResponse = JSON.parse(cleanedJsonResponse);
    return {
      title: parsedResponse.title,
      excerpt: parsedResponse.excerpt,
      content: parsedResponse.content,
      category: category,
      tags: parsedResponse.tags || []
    };
  } catch (error) {
    console.error('Erro ao analisar resposta JSON da OpenAI:', error);
    throw new Error('Falha ao processar a resposta do artigo gerado');
  }
}
