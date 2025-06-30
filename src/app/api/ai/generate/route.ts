import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-options';
import { generateContent, generateSeoTitle, generateSeoDescription, generateArticleOutline, generateFullArticle, improveContent, generateBulkArticle } from '@/services/openai';
import PostModel from '@/models/post';
import CategoryModel from '@/models/category';
import { connectToDatabase } from '@/lib/mongoose';
import { slugify } from '@/lib/utils';
import mongoose from 'mongoose';

// Função para lidar com requisições POST
export async function POST(req: Request) {
  // Verificar autenticação
  const session = await getServerSession(authOptions);
  
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    // Extrair dados da requisição - lê apenas uma vez
    const requestData = await req.json();
    const { action, prompt, topic, content, outline, model, maxTokens, 
            keywords, category, charCount, customPrompt, saveToDatabase, coverImage } = requestData;

    // Verificar se a ação é válida
    if (!action) {
      return NextResponse.json({ error: 'Ação não especificada' }, { status: 400 });
    }

    let result = '';

    // Executar a ação apropriada
    switch (action) {
      case 'generate-content':
        if (!prompt) {
          return NextResponse.json({ error: 'Prompt não especificado' }, { status: 400 });
        }
        result = await generateContent(prompt, model, maxTokens);
        break;

      case 'generate-title':
        if (!topic) {
          return NextResponse.json({ error: 'Tópico não especificado' }, { status: 400 });
        }
        result = await generateSeoTitle(topic);
        break;

      case 'generate-description':
        if (!topic) {
          return NextResponse.json({ error: 'Tópico não especificado' }, { status: 400 });
        }
        result = await generateSeoDescription(topic);
        break;

      case 'generate-outline':
        if (!topic) {
          return NextResponse.json({ error: 'Tópico não especificado' }, { status: 400 });
        }
        result = await generateArticleOutline(topic);
        break;

      case 'generate-article':
        if (!topic) {
          return NextResponse.json({ error: 'Tópico não especificado' }, { status: 400 });
        }
        result = await generateFullArticle(topic, outline);
        break;

      case 'improve-content':
        if (!content) {
          return NextResponse.json({ error: 'Conteúdo não especificado' }, { status: 400 });
        }
        result = await improveContent(content);
        break;
        
      case 'generate-bulk-article':
        // Já extraímos os dados na parte superior da função
        if (!keywords) {
          return NextResponse.json({ error: 'Palavras-chave não especificadas' }, { status: 400 });
        }
        
        // Gerar o artigo com base nas palavras-chave
        const generatedArticle = await generateBulkArticle(
          keywords, 
          category || 'Geral', 
          charCount || 3000, 
          customPrompt || ''
        );
        
        // Se solicitado para salvar no banco de dados
        if (saveToDatabase) {
          try {
            await connectToDatabase();
            
            // Encontrar ou criar a categoria
            let categoryId = null;
            if (category) {
              const categorySlug = slugify(category);
              const existingCategory = await CategoryModel.findOne({ slug: categorySlug });
              
              if (existingCategory) {
                categoryId = existingCategory._id;
              } else {
                const newCategory = await CategoryModel.create({
                  name: category,
                  slug: categorySlug,
                  description: `Categoria para artigos sobre ${category}`
                });
                categoryId = newCategory._id;
              }
            }
            
            // Criar o slug para o post
            const slug = slugify(generatedArticle.title);
            
            // Verificar se o slug já existe
            const existingPost = await PostModel.findOne({ slug });
            const finalSlug = existingPost ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
            
            // Criar o post no banco de dados
            const newPost = await PostModel.create({
              title: generatedArticle.title,
              slug: finalSlug,
              content: generatedArticle.content,
              excerpt: generatedArticle.excerpt,
              published: true,
              publishedAt: new Date(),
              tags: generatedArticle.tags,
              category: categoryId,
              coverImage: coverImage || '',
              author: new mongoose.Types.ObjectId('000000000000000000000000') // Temporário
            });
            
            // Retornar o artigo gerado e o ID do post criado
            return NextResponse.json({
              result: JSON.stringify(generatedArticle),
              postId: newPost._id.toString(),
              postSlug: finalSlug,
              saved: true
            });
          } catch (dbError: any) {
            console.error('Erro ao salvar artigo no banco de dados:', dbError);
            return NextResponse.json({
              result: JSON.stringify(generatedArticle),
              error: `Erro ao salvar no banco de dados: ${dbError.message}`,
              saved: false
            });
          }
        }
        
        // Se não for para salvar, apenas retorna o artigo gerado
        result = JSON.stringify(generatedArticle);
        break;

      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }

    // Retornar o resultado
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Erro na API de IA:', error);
    return NextResponse.json(
      { error: `Erro ao processar a solicitação: ${error.message}` },
      { status: 500 }
    );
  }
}


