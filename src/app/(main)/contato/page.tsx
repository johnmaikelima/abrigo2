'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useBlogSettings } from '@/hooks/use-blog-settings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MapEmbed from '@/components/contact/map-embed';

export default function ContatoPage() {
  const { settings, isLoading } = useBlogSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    captchaAnswer: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  
  // Captcha simples
  const captchaRef = useRef({
    num1: Math.floor(Math.random() * 10),
    num2: Math.floor(Math.random() * 10),
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar captcha
    if (settings?.contactForm?.captchaEnabled) {
      const correctAnswer = (captchaRef.current.num1 + captchaRef.current.num2).toString();
      if (formData.captchaAnswer !== correctAnswer) {
        toast({
          title: "Erro de verificação",
          description: "A resposta do captcha está incorreta. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          captchaAnswer: '',
        });
        // Gerar novo captcha
        captchaRef.current = {
          num1: Math.floor(Math.random() * 10),
          num2: Math.floor(Math.random() * 10),
        };
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-4xl font-bold text-center mb-8">Entre em Contato</h1>
      <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
        Estamos aqui para responder suas perguntas e ouvir seus comentários. Preencha o formulário abaixo ou use um dos nossos canais de contato.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {settings?.contactEmail && (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`mailto:${settings.contactEmail}`} className="text-primary hover:underline">
                {settings.contactEmail}
              </a>
            </CardContent>
          </Card>
        )}
        
        {settings?.contactPhone && (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Telefone</CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`tel:${settings.contactPhone.replace(/\D/g, '')}`} className="text-primary hover:underline">
                {settings.contactPhone}
              </a>
            </CardContent>
          </Card>
        )}
        
        {settings?.address?.street && (
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic mb-4">
                {settings.address.street}, {settings.address.number}<br />
                {settings.address.city}, {settings.address.state}<br />
                {settings.address.zipCode}
              </address>
              
              {/* Mapa do Google */}
              <MapEmbed 
                address={`${settings.address.street}, ${settings.address.number}, ${settings.address.city}, ${settings.address.state}, ${settings.address.zipCode}`}
                height="150px"
                className="mt-2"
                zoom={14}
              />
            </CardContent>
          </Card>
        )}
      </div>
      
      {settings?.contactForm?.enabled && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Envie uma mensagem</CardTitle>
              <CardDescription>Preencha o formulário abaixo e entraremos em contato o mais breve possível.</CardDescription>
            </CardHeader>
            <CardContent>
              {formStatus === 'success' && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>
                    {settings?.contactForm?.successMessage || 'Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.'}
                  </AlertDescription>
                </Alert>
              )}
              
              {formStatus === 'error' && (
                <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
                  <AlertDescription>
                    {settings?.contactForm?.errorMessage || 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.'}
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Seu nome" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="seu.email@exemplo.com" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input 
                    id="subject" 
                    name="subject" 
                    placeholder="Assunto da mensagem" 
                    required 
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    placeholder="Digite sua mensagem aqui..." 
                    rows={5} 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                {settings?.contactForm?.captchaEnabled && (
                  <div className="space-y-2">
                    <Label htmlFor="captcha">
                      Verificação: Quanto é {captchaRef.current.num1} + {captchaRef.current.num2}?
                    </Label>
                    <Input 
                      id="captchaAnswer" 
                      name="captchaAnswer" 
                      placeholder="Digite a resposta" 
                      required 
                      value={formData.captchaAnswer}
                      onChange={handleChange}
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Seção de mapa completo */}
      {settings?.address?.street && (
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Nossa Localização</h2>
          <div className="rounded-lg overflow-hidden shadow-lg border border-border">
            <MapEmbed 
              address={`${settings.address.street}, ${settings.address.number}, ${settings.address.city}, ${settings.address.state}, ${settings.address.zipCode}`}
              height="500px"
              zoom={16}
            />
          </div>
          <div className="mt-4 text-center text-muted-foreground">
            <p>
              {settings.address.street}, {settings.address.number} - {settings.address.city}, {settings.address.state} - {settings.address.zipCode}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
