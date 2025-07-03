import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ThemeSettings from '@/models/theme-settings';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Buscar o tema padrão
    const defaultTheme = await ThemeSettings.findOne({ isDefault: true });
    
    // Se não houver tema padrão, criar um
    if (!defaultTheme) {
      const newDefaultTheme = await ThemeSettings.create({
        name: 'Tema Padrão',
        isDefault: true,
        colors: {
          primary: '#2563eb',
          secondary: '#10b981',
          background: '#ffffff',
          text: '#111827',
          accent: '#f59e0b',
        },
        header: {
          showLogo: true,
          logoUrl: '/logo.png',
          showNavigation: true,
          navigationItems: [
            { label: 'Home', url: '/', isExternal: false },
            { label: 'Blog', url: '/blog', isExternal: false },
            { label: 'Sobre', url: '/sobre', isExternal: false },
            { label: 'Contato', url: '/contato', isExternal: false },
          ],
          sticky: true,
          height: 80,
        },
        footer: {
          showCopyright: true,
          copyrightText: '© 2025 Blog. Todos os direitos reservados.',
          showSocialLinks: true,
          socialLinks: [
            { platform: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
            { platform: 'Facebook', url: 'https://facebook.com', icon: 'facebook' },
            { platform: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
          ],
          columns: [
            {
              title: 'Links Úteis',
              links: [
                { label: 'Home', url: '/', isExternal: false },
                { label: 'Blog', url: '/blog', isExternal: false },
                { label: 'Sobre', url: '/sobre', isExternal: false },
              ],
            },
            {
              title: 'Legal',
              links: [
                { label: 'Termos de Uso', url: '/termos', isExternal: false },
                { label: 'Privacidade', url: '/privacidade', isExternal: false },
              ],
            },
          ],
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          baseFontSize: 16,
        },
      });
      
      return NextResponse.json(newDefaultTheme);
    }
    
    return NextResponse.json(defaultTheme);
  } catch (error) {
    console.error('Erro ao buscar configurações de tema:', error);
    return NextResponse.json({ error: 'Erro ao buscar configurações de tema' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const data = await request.json();
    
    // Buscar o tema padrão
    const defaultTheme = await ThemeSettings.findOne({ isDefault: true });
    
    if (!defaultTheme) {
      return NextResponse.json({ error: 'Tema padrão não encontrado' }, { status: 404 });
    }
    
    // Atualizar o tema padrão
    const updatedTheme = await ThemeSettings.findByIdAndUpdate(
      defaultTheme._id,
      { $set: data },
      { new: true, runValidators: true }
    );
    
    return NextResponse.json(updatedTheme);
  } catch (error) {
    console.error('Erro ao atualizar configurações de tema:', error);
    return NextResponse.json({ error: 'Erro ao atualizar configurações de tema' }, { status: 500 });
  }
}
