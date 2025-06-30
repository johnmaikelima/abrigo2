import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import BlogSettingsModel from '@/models/blog-settings';
import { withAdminAuth } from '../../users/middleware';

// GET /api/settings/blog - Obter configurações do blog
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Buscar configurações ou criar se não existirem
    const settings = await BlogSettingsModel.findOne() || await new BlogSettingsModel().save();
    
    // Retornar no formato esperado pelo componente
    return NextResponse.json({
      success: true,
      settings: settings
    });
  } catch (error) {
    console.error('Erro ao obter configurações do blog:', error);
    return NextResponse.json(
      { error: 'Erro ao obter configurações do blog', message: error instanceof Error ? error.message : 'Erro desconhecido' }, 
      { status: 500 }
    );
  }
}

// PUT /api/settings/blog - Atualizar configurações do blog
export async function PUT(request: NextRequest) {
  return withAdminAuth(request, async (req) => {
    try {
      await connectToDatabase();
      
      const data = await req.json();
      
      // Buscar configurações ou criar se não existirem
      let settings = await BlogSettingsModel.findOne();
      
      if (!settings) {
        settings = new BlogSettingsModel();
      }
      
      // Atualizar campos
      if (data.name !== undefined) settings.name = data.name;
      if (data.description !== undefined) settings.description = data.description;
      if (data.logo !== undefined) settings.logo = data.logo;
      if (data.favicon !== undefined) settings.favicon = data.favicon;
      if (data.defaultAuthorName !== undefined) settings.defaultAuthorName = data.defaultAuthorName;
      if (data.defaultAuthorEmail !== undefined) settings.defaultAuthorEmail = data.defaultAuthorEmail;
      if (data.contactEmail !== undefined) settings.contactEmail = data.contactEmail;
      if (data.contactPhone !== undefined) settings.contactPhone = data.contactPhone;
      if (data.contactWhatsapp !== undefined) settings.contactWhatsapp = data.contactWhatsapp;
      
      // Atualizar configuração do WhatsApp
      if (data.whatsappConfig) {
        if (!settings.whatsappConfig) {
          settings.whatsappConfig = {
            number: '',
            message: 'Olá! Vim pelo site e gostaria de algumas informações.',
            hoverText: 'Precisa de ajuda? Fale conosco!',
            enabled: false
          };
        }
        if (data.whatsappConfig.number !== undefined) settings.whatsappConfig.number = data.whatsappConfig.number;
        if (data.whatsappConfig.message !== undefined) settings.whatsappConfig.message = data.whatsappConfig.message;
        if (data.whatsappConfig.hoverText !== undefined) settings.whatsappConfig.hoverText = data.whatsappConfig.hoverText;
        if (data.whatsappConfig.enabled !== undefined) settings.whatsappConfig.enabled = data.whatsappConfig.enabled;
      }
      
      // Atualizar página inicial
      if (data.homePage) {
        if (!settings.homePage) {
          settings.homePage = {
            type: 'default',
            id: '',
            slug: '',
            title: ''
          };
        }
        if (data.homePage.type !== undefined) settings.homePage.type = data.homePage.type;
        if (data.homePage.id !== undefined) settings.homePage.id = data.homePage.id;
        if (data.homePage.slug !== undefined) settings.homePage.slug = data.homePage.slug;
        if (data.homePage.title !== undefined) settings.homePage.title = data.homePage.title;
      }
      
      // Atualizar redes sociais
      if (data.socialMedia) {
        if (data.socialMedia.facebook !== undefined) settings.socialMedia.facebook = data.socialMedia.facebook;
        if (data.socialMedia.twitter !== undefined) settings.socialMedia.twitter = data.socialMedia.twitter;
        if (data.socialMedia.instagram !== undefined) settings.socialMedia.instagram = data.socialMedia.instagram;
        if (data.socialMedia.linkedin !== undefined) settings.socialMedia.linkedin = data.socialMedia.linkedin;
        if (data.socialMedia.youtube !== undefined) settings.socialMedia.youtube = data.socialMedia.youtube;
      }
      
      // Atualizar endereço
      if (data.address) {
        if (!settings.address) {
          settings.address = {};
        }
        if (data.address.street !== undefined) settings.address.street = data.address.street;
        if (data.address.number !== undefined) settings.address.number = data.address.number;
        if (data.address.city !== undefined) settings.address.city = data.address.city;
        if (data.address.state !== undefined) settings.address.state = data.address.state;
        if (data.address.country !== undefined) settings.address.country = data.address.country;
        if (data.address.zipCode !== undefined) settings.address.zipCode = data.address.zipCode;
      }
      
      // Atualizar menus
      if (data.menus !== undefined) {
        settings.menus = data.menus;
      }
      
      // Atualizar configurações SMTP
      if (data.smtp) {
        if (!settings.smtp) {
          settings.smtp = {
            host: '',
            port: 587,
            secure: false,
            auth: {
              user: '',
              pass: ''
            },
            from: ''
          };
        }
        if (data.smtp.host !== undefined) settings.smtp.host = data.smtp.host;
        if (data.smtp.port !== undefined) settings.smtp.port = data.smtp.port;
        if (data.smtp.secure !== undefined) settings.smtp.secure = data.smtp.secure;
        if (data.smtp.from !== undefined) settings.smtp.from = data.smtp.from;
        
        // Atualizar autenticação SMTP
        if (data.smtp.auth) {
          if (!settings.smtp.auth) {
            settings.smtp.auth = { user: '', pass: '' };
          }
          if (data.smtp.auth.user !== undefined) settings.smtp.auth.user = data.smtp.auth.user;
          if (data.smtp.auth.pass !== undefined) settings.smtp.auth.pass = data.smtp.auth.pass;
        }
      }
      
      // Atualizar configurações do formulário de contato
      if (data.contactForm) {
        if (!settings.contactForm) {
          settings.contactForm = {
            enabled: true,
            recipientEmail: '',
            captchaEnabled: true,
            successMessage: 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.',
            errorMessage: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.'
          };
        }
        if (data.contactForm.enabled !== undefined) settings.contactForm.enabled = data.contactForm.enabled;
        if (data.contactForm.recipientEmail !== undefined) settings.contactForm.recipientEmail = data.contactForm.recipientEmail;
        if (data.contactForm.captchaEnabled !== undefined) settings.contactForm.captchaEnabled = data.contactForm.captchaEnabled;
        if (data.contactForm.successMessage !== undefined) settings.contactForm.successMessage = data.contactForm.successMessage;
        if (data.contactForm.errorMessage !== undefined) settings.contactForm.errorMessage = data.contactForm.errorMessage;
      }
      
      await settings.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Configurações do blog atualizadas com sucesso',
        settings
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações do blog:', error);
      return NextResponse.json(
        { error: 'Erro ao atualizar configurações do blog', message: error instanceof Error ? error.message : 'Erro desconhecido' }, 
        { status: 500 }
      );
    }
  });
}
