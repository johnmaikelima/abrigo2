import { parse } from 'node-html-parser';

/**
 * Extrai elementos HTML específicos de uma string HTML
 * @param html String HTML para analisar
 * @param selectors Seletores CSS para extrair (ex: 'meta, link, title')
 * @returns String HTML com os elementos extraídos
 */
export function extractHtmlElements(html: string, selectors: string): string {
  if (!html) return '';
  
  try {
    // Envolver o conteúdo em um elemento raiz para facilitar o parsing
    const root = parse(`<div>${html}</div>`);
    
    // Extrair os elementos solicitados
    const elements = root.querySelectorAll(selectors).map(el => el.toString()).join('');
    
    return elements;
  } catch (error) {
    console.error('Erro ao analisar HTML personalizado:', error);
    return '';
  }
}

/**
 * Converte elementos HTML para um formato seguro para renderização no servidor
 * @param html String HTML para processar
 * @returns Objeto com elementos HTML processados
 */
export function processHtmlForServerRendering(html: string) {
  // Extrair meta tags, links e outros elementos estáticos importantes para SEO
  const metaTags = extractHtmlElements(html, 'meta, link[rel], title');
  
  // Extrair scripts
  const scripts = extractHtmlElements(html, 'script');
  
  // Extrair outros elementos (divs, spans, etc)
  const otherElements = extractHtmlElements(html, 'div, span, p, h1, h2, h3, h4, h5, h6, a, img, ul, ol, li, table');
  
  return { metaTags, scripts, otherElements };
}
