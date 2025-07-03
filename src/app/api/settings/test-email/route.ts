import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { withAdminAuth } from '@/lib/auth';

export const POST = withAdminAuth(async (req: Request) => {
  try {
    const { smtp, recipient } = await req.json();
    
    // Validar dados
    if (!smtp || !smtp.host || !smtp.auth?.user || !smtp.auth?.pass || !recipient) {
      return NextResponse.json(
        { error: 'Configurações SMTP incompletas' },
        { status: 400 }
      );
    }
    
    // Configurar o transporte de email
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.secure || false,
      auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
      },
    });
    
    // Verificar a conexão com o servidor SMTP
    await transporter.verify();
    
    // Configurar o email de teste
    const mailOptions = {
      from: smtp.from || `"Teste" <${smtp.auth.user}>`,
      to: recipient,
      subject: 'Teste de Configuração SMTP',
      text: 'Se você está recebendo este email, suas configurações SMTP estão funcionando corretamente.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Teste de Configuração SMTP</h2>
          <p>Se você está recebendo este email, suas configurações SMTP estão funcionando corretamente.</p>
          <p>Detalhes da configuração:</p>
          <ul>
            <li><strong>Servidor:</strong> ${smtp.host}</li>
            <li><strong>Porta:</strong> ${smtp.port || 587}</li>
            <li><strong>Usuário:</strong> ${smtp.auth.user}</li>
            <li><strong>Conexão segura:</strong> ${smtp.secure ? 'Sim' : 'Não'}</li>
          </ul>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Este é um email automático enviado para testar suas configurações SMTP.
            Não é necessário responder a este email.
          </p>
        </div>
      `,
    };
    
    // Enviar o email
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao testar configurações SMTP:', error);
    
    // Extrair mensagem de erro mais útil
    let errorMessage = 'Erro ao testar configurações SMTP';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
});
