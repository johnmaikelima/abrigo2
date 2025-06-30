import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    
    // Obter dados do formulário
    const { name, email, subject, message } = await req.json();
    
    // Validar dados
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Buscar configurações do blog
    const blogSettings = await BlogSettingsModel.findOne().lean();
    
    if (!blogSettings) {
      return NextResponse.json(
        { error: 'Configurações do blog não encontradas' },
        { status: 500 }
      );
    }
    
    // Verificar se as configurações de SMTP estão definidas
    if (!blogSettings.smtp || !blogSettings.smtp.host || !blogSettings.smtp.auth.user) {
      return NextResponse.json(
        { error: 'Configurações de SMTP não definidas' },
        { status: 500 }
      );
    }
    
    // Definir o destinatário do email
    const recipient = blogSettings.contactForm?.recipientEmail || blogSettings.contactEmail;
    
    if (!recipient) {
      return NextResponse.json(
        { error: 'Email de destinatário não configurado' },
        { status: 500 }
      );
    }
    
    // Configurar o transporte de email
    const transporter = nodemailer.createTransport({
      host: blogSettings.smtp.host,
      port: blogSettings.smtp.port || 587,
      secure: blogSettings.smtp.secure || false,
      auth: {
        user: blogSettings.smtp.auth.user,
        pass: blogSettings.smtp.auth.pass,
      },
    });
    
    // Configurar o email
    const mailOptions = {
      from: blogSettings.smtp.from || `"${blogSettings.name}" <${blogSettings.smtp.auth.user}>`,
      to: recipient,
      replyTo: email,
      subject: `[Formulário de Contato] ${subject}`,
      text: `Nome: ${name}\nEmail: ${email}\nAssunto: ${subject}\n\nMensagem:\n${message}`,
      html: `
        <h2>Nova mensagem do formulário de contato</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <h3>Mensagem:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // Enviar o email
    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar formulário de contato:', error);
    return NextResponse.json(
      { error: 'Erro ao processar formulário de contato' },
      { status: 500 }
    );
  }
}
