import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { withAdminAuth } from '../users/middleware';

// POST /api/upload - Upload de arquivos
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
      const extension = originalName.split('.').pop();
      const fileName = `${timestamp}-${originalName}`;
      
      // Determinar o diretório de destino com base no tipo
      let uploadDir = 'uploads';
      if (type === 'logo') {
        uploadDir = 'logos';
      } else if (type === 'favicon') {
        uploadDir = 'favicons';
      } else if (type === 'post') {
        uploadDir = 'posts';
      }
      
      // Criar diretório de destino
      const publicDir = join(process.cwd(), 'public');
      const uploadPath = join(publicDir, uploadDir);
      
      // Verificar se o diretório existe e criar se não existir
      if (!existsSync(uploadPath)) {
        try {
          await mkdir(uploadPath, { recursive: true });
          console.log(`Diretório criado: ${uploadPath}`);
        } catch (err) {
          console.error(`Erro ao criar diretório ${uploadPath}:`, err);
          return NextResponse.json(
            { error: 'Erro ao criar diretório de upload' },
            { status: 500 }
          );
        }
      }
      
      // Converter o arquivo para um Buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Salvar o arquivo
      const filePath = join(uploadPath, fileName);
      try {
        await writeFile(filePath, buffer);
        console.log(`Arquivo salvo em: ${filePath}`);
      } catch (err) {
        console.error(`Erro ao salvar arquivo ${filePath}:`, err);
        return NextResponse.json(
          { error: 'Erro ao salvar arquivo' },
          { status: 500 }
        );
      }
      
      // Retornar o caminho do arquivo
      const fileUrl = `/${uploadDir}/${fileName}`;
      
      return NextResponse.json({ 
        success: true, 
        fileUrl,
        fileName,
        type: file.type,
        size: file.size
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
