import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth } from '../users/middleware';

// Forçar que esta rota seja sempre dinâmica
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// POST /api/upload - Upload de arquivos usando ImageKit.io
export async function POST(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const type = formData.get('type') as string | null;
      
      if (!file) {
        return NextResponse.json(
          { error: 'Nenhum arquivo enviado' }, 
          { status: 400 }
        );
      }
      
      // Verificar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Tipo de arquivo não suportado. Envie apenas imagens (JPG, PNG, SVG, WEBP, GIF)' }, 
          { status: 400 }
        );
      }
      
      // Limitar tamanho do arquivo (2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: 'Arquivo muito grande. O tamanho máximo é 2MB' }, 
          { status: 400 }
        );
      }
      
      // Gerar nome de arquivo único
      const timestamp = Date.now();
      const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '-').toLowerCase();
      const fileName = `${timestamp}-${originalName}`;
      
      // Determinar a pasta de destino com base no tipo
      let folder = 'uploads';
      if (type === 'logo') {
        folder = 'logos';
      } else if (type === 'favicon') {
        folder = 'favicons';
      } else if (type === 'post') {
        folder = 'posts';
      }
      
      // Converter o arquivo para um Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Configurar as credenciais do ImageKit
      const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
      const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
      const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
      
      // Verificar se as credenciais estão configuradas
      if (!publicKey || !privateKey || !urlEndpoint) {
        console.error('Credenciais do ImageKit não estão configuradas corretamente');
        return NextResponse.json(
          { error: 'Configuração do ImageKit incompleta. Verifique as variáveis de ambiente.' },
          { status: 500 }
        );
      }
      
      // Prosseguir com o upload para o ImageKit
      
      // Preparar o upload para o ImageKit usando fetch e FormData
      const uploadFormData = new FormData();
      uploadFormData.append('file', new Blob([buffer]), fileName);
      uploadFormData.append('fileName', fileName);
      uploadFormData.append('folder', folder);
      
      // Criar o token de autenticação Basic para a API do ImageKit
      const authToken = Buffer.from(`${privateKey}:`).toString('base64');
      
      // Fazer o upload para o ImageKit
      const uploadResponse = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authToken}`
        },
        body: uploadFormData
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        console.error('Erro na resposta do ImageKit:', errorData);
        return NextResponse.json(
          { error: 'Erro ao fazer upload para o ImageKit', details: errorData },
          { status: uploadResponse.status }
        );
      }
      
      // Processar a resposta do ImageKit
      const imageKitResponse = await uploadResponse.json();
      
      // Retornar a URL da imagem e outros detalhes
      return NextResponse.json({ 
        success: true, 
        fileUrl: imageKitResponse.url,
        fileName: imageKitResponse.name,
        type: file.type,
        size: file.size,
        imagekit: {
          fileId: imageKitResponse.fileId,
          url: imageKitResponse.url,
          thumbnailUrl: imageKitResponse.thumbnailUrl
        }
      });
    } catch (error) {
      console.error('Erro ao fazer upload de arquivo:', error);
      return NextResponse.json(
        { error: 'Erro ao fazer upload de arquivo', message: error instanceof Error ? error.message : 'Erro desconhecido' }, 
        { status: 500 }
      );
    }
  });
}
