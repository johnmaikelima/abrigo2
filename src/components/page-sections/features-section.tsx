'use client';

import React from 'react';
import { HtmlContent } from './html-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';

interface FeatureItem {
  title: string;
  content: string;
  icon?: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  backgroundColor?: string;
  textColor?: string;
}

// Função para renderizar ícones do Lucide React
const renderIcon = (iconName: string) => {
  // Mapeamento de nomes comuns para os nomes corretos do Lucide
  const iconMapping: Record<string, string> = {
    // Mapeamentos comuns
    'checkmark': 'Check',
    'check-mark': 'Check',
    'money': 'DollarSign',
    'dollar': 'DollarSign',
    'cash': 'Banknote',
    'user': 'User',
    'users': 'Users',
    'person': 'User',
    'people': 'Users',
    'gear': 'Settings',
    'cog': 'Settings',
    'settings': 'Settings',
    'star': 'Star',
    'heart': 'Heart',
    'mail': 'Mail',
    'email': 'Mail',
    'phone': 'Phone',
    'calendar': 'Calendar',
    'clock': 'Clock',
    'time': 'Clock',
    'location': 'MapPin',
    'map': 'Map',
    'pin': 'MapPin',
    'search': 'Search',
    'magnifier': 'Search',
    'home': 'Home',
    'house': 'Home',
    'building': 'Building',
    'chat': 'MessageSquare',
    'message': 'MessageCircle',
    'comment': 'MessageSquare',
    'lock': 'Lock',
    'security': 'Shield',
    'shield': 'Shield',
    'cart': 'ShoppingCart',
    'shopping': 'ShoppingBag',
    'tag': 'Tag',
    'price': 'Tag',
    'bell': 'Bell',
    'notification': 'Bell',
    'alert': 'AlertCircle',
    'warning': 'AlertTriangle',
    'info': 'Info',
    'question': 'HelpCircle',
    'help': 'HelpCircle',
    'download': 'Download',
    'upload': 'Upload',
    'refresh': 'RefreshCw',
    'reload': 'RotateCw',
    'trash': 'Trash',
    'delete': 'Trash',
    'edit': 'Edit',
    'pencil': 'Pencil',
    'save': 'Save',
    'disk': 'Save',
    'link': 'Link',
    'chain': 'Link',
    'image': 'Image',
    'picture': 'Image',
    'photo': 'Image',
    'video': 'Video',
    'film': 'Film',
    'camera': 'Camera',
    'mic': 'Mic',
    'microphone': 'Mic',
    'vol': 'Volume',
    'sound': 'Volume',
    'speaker': 'Volume',
    'wifi': 'Wifi',
    'connection': 'Wifi',
    'bluetooth': 'Bluetooth',
    'battery': 'Battery',
    'power': 'Power',
    'sun': 'Sun',
    'moon': 'Moon',
    'cloud': 'Cloud',
    'weather': 'Cloud',
    'rain': 'CloudRain',
    'snow': 'CloudSnow',
    'wind': 'Wind',
    'compass': 'Compass',
    'navigation': 'Navigation',
    'flag': 'Flag',
    'bookmark': 'Bookmark',
    'thumbsup': 'ThumbsUp',
    'like': 'ThumbsUp',
    'thumbsdown': 'ThumbsDown',
    'dislike': 'ThumbsDown',
    'eye': 'Eye',
    'view': 'Eye',
    'visibility': 'Eye',
    'eyeoff': 'EyeOff',
    'hidden': 'EyeOff',
    'invisible': 'EyeOff',
    'zap': 'Zap',
    'lightning': 'Zap',
    'flash': 'Zap',
    'fire': 'Flame',
    'flame': 'Flame',
    'hot': 'Flame',
    'trending': 'TrendingUp',
    'popular': 'TrendingUp',
    'gift': 'Gift',
    'present': 'Gift',
    'package': 'Package',
    'box': 'Package',
    'archive': 'Archive',
    'folder': 'Folder',
    'file': 'File',
    'document': 'FileText',
    'copy': 'Copy',
    'clipboard': 'Clipboard',
    'paste': 'ClipboardCheck',
    'print': 'Printer',
    'share': 'Share',
    'external': 'ExternalLink',
    'arrow': 'ArrowRight',
    'next': 'ArrowRight',
    'prev': 'ArrowLeft',
    'back': 'ArrowLeft',
    'up': 'ArrowUp',
    'down': 'ArrowDown',
    'menu': 'Menu',
    'list': 'List',
    'grid': 'Grid',
    'layout': 'Layout',
    'sidebar': 'Sidebar',
    'columns': 'Columns',
    'rows': 'Rows',
    'table': 'Table',
    'filter': 'Filter',
    'sort': 'SortAsc',
    'order': 'SortAsc',
    'key': 'Key',
    'password': 'Key',
    'login': 'LogIn',
    'signin': 'LogIn',
    'logout': 'LogOut',
    'signout': 'LogOut',
    'register': 'UserPlus',
    'signup': 'UserPlus',
    'globe': 'Globe',
    'world': 'Globe',
    'earth': 'Globe',
    'planet': 'Globe',
    'target': 'Target',
    'aim': 'Target',
    'goal': 'Target',
    'sourcecode': 'Code',
    'terminal': 'Terminal',
    'command': 'Terminal',
    'git': 'GitBranch',
    'github': 'Github',
    'gitlab': 'Gitlab',
    'twitter': 'Twitter',
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'linkedin': 'Linkedin',
    'youtube': 'Youtube',
    'twitch': 'Twitch',
    'slack': 'Slack',
    'discord': 'MessageSquare',
    'figma': 'Figma',
    'sketch': 'Triangle',
    'adobe': 'Square',
    'photoshop': 'Image',
    'illustrator': 'PenTool',
    'xd': 'Square',
    'indesign': 'Square',
    'premiere': 'Video',
    'aftereffects': 'Video',
    'lightroom': 'Image',
    'audition': 'Music',
    'music': 'Music',
    'audio': 'Music',
    'play': 'Play',
    'pause': 'Pause',
    'stop': 'Square',
    'rewind': 'Rewind',
    'fastforward': 'FastForward',
    'skip': 'SkipForward',
    'skipback': 'SkipBack',
    'shuffle': 'Shuffle',
    'repeat': 'Repeat',
    'volume2': 'Volume2',
    'mute': 'VolumeX',
    'headphones': 'Headphones',
    'tv': 'Tv',
    'monitor': 'Monitor',
    'desktop': 'Monitor',
    'laptop': 'Laptop',
    'tablet': 'Tablet',
    'mobile': 'Smartphone',
    'phone': 'Phone',
    'smartphone': 'Smartphone',
    'watch': 'Watch',
    'server': 'Server',
    'database': 'Database',
    'storage': 'HardDrive',
    'harddrive': 'HardDrive',
    'cpu': 'Cpu',
    'processor': 'Cpu',
    'chip': 'Cpu',
    'memory': 'Memory',
    'ram': 'Memory',
    'activity': 'Activity',
    'pulse': 'Activity',
    'health': 'Activity',
    'heart': 'Heart',
    'heartbeat': 'HeartPulse',
    'thermometer': 'Thermometer',
    'temperature': 'Thermometer',
    'umbrella': 'Umbrella',
    'coffee': 'Coffee',
    'food': 'Utensils',
    'restaurant': 'Utensils',
    'utensils': 'Utensils',
    'car': 'Car',
    'truck': 'Truck',
    'bus': 'Bus',
    'train': 'Train',
    'plane': 'Plane',
    'flight': 'Plane',
    'rocket': 'Rocket',
    'space': 'Rocket',
    'launch': 'Rocket',
    'book': 'Book',
    'read': 'BookOpen',
    'library': 'Library',
    'graduation': 'GraduationCap',
    'education': 'GraduationCap',
    'school': 'GraduationCap',
    'university': 'GraduationCap',
    'college': 'GraduationCap',
    'briefcase': 'Briefcase',
    'work': 'Briefcase',
    'job': 'Briefcase',
    'business': 'Briefcase',
    'suitcase': 'Briefcase',
    'tool': 'Tool',
    'tools': 'Tool',
    'wrench': 'Wrench',
    'settings': 'Settings',
    'preferences': 'Settings',
    'options': 'Settings',
    'sliders': 'Sliders',
    'toggle': 'ToggleLeft',
    'switch': 'ToggleLeft',
    'checkbox': 'CheckSquare',
    'radio': 'Circle',
    'form': 'FileText',
    'input': 'Type',
    'text': 'Type',
    'font': 'Type',
    'typography': 'Type',
    'bold': 'Bold',
    'italic': 'Italic',
    'underline': 'Underline',
    'strikethrough': 'Strikethrough',
    'align': 'AlignLeft',
    'alignleft': 'AlignLeft',
    'aligncenter': 'AlignCenter',
    'alignright': 'AlignRight',
    'alignjustify': 'AlignJustify',
    'indent': 'Indent',
    'outdent': 'Outdent',
    'list': 'List',
    'orderedlist': 'ListOrdered',
    'unorderedlist': 'List',
    'checklist': 'ListChecks',
    'todo': 'ListChecks',
    'tasks': 'ListChecks',
    'quote': 'Quote',
    'blockquote': 'Quote',
    'citation': 'Quote',
    'codesnippet': 'Code',
    'brackets': 'Code',
    'link': 'Link',
    'unlink': 'Link2Off',
    'image': 'Image',
    'picture': 'Image',
    'photo': 'Image',
    'gallery': 'Images',
    'album': 'Images',
    'video': 'Video',
    'film': 'Film',
    'movie': 'Film',
    'audio': 'Music',
    'soundfile': 'Music',
    'attachment': 'Paperclip',
    'paperclip': 'Paperclip',
    'emoji': 'Smile',
    'emoticon': 'Smile',
    'smile': 'Smile',
    'happy': 'Smile',
    'sad': 'Frown',
    'unhappy': 'Frown',
    'meh': 'Meh',
    'neutral': 'Meh',
    'laugh': 'Laugh',
    'lol': 'Laugh',
    'thumbsup': 'ThumbsUp',
    'like': 'ThumbsUp',
    'thumbsdown': 'ThumbsDown',
    'dislike': 'ThumbsDown',
  };

  // Converter o nome do ícone para o formato PascalCase usado pelo Lucide
  const formatIconName = (name: string): string => {
    // Primeiro verificar se temos um mapeamento direto
    const lowerName = name.toLowerCase();
    if (iconMapping[lowerName]) {
      return iconMapping[lowerName];
    }
    
    // Remover caracteres não alfanuméricos e converter para camelCase
    const camelCase = name
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .split(' ')
      .map((word, index) => {
        if (word.length === 0) return '';
        return index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
    
    // Converter para PascalCase
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
  };

  try {
    // Tenta encontrar o ícone com o nome formatado
    const iconNamePascal = formatIconName(iconName);
    const Icon = (LucideIcons as any)[iconNamePascal];
    
    if (Icon) {
      return <Icon className="h-5 w-5" />;
    }
    
    // Se não encontrou, tenta com o nome original
    const IconOriginal = (LucideIcons as any)[iconName];
    if (IconOriginal) {
      return <IconOriginal className="h-5 w-5" />;
    }
    
    // Tenta encontrar um ícone genérico baseado no nome
    if (iconName.toLowerCase().includes('check')) {
      return <LucideIcons.Check className="h-5 w-5" />;
    }
    if (iconName.toLowerCase().includes('money') || iconName.toLowerCase().includes('dollar')) {
      return <LucideIcons.DollarSign className="h-5 w-5" />;
    }
    if (iconName.toLowerCase().includes('user')) {
      return <LucideIcons.User className="h-5 w-5" />;
    }
    if (iconName.toLowerCase().includes('setting') || iconName.toLowerCase().includes('gear') || iconName.toLowerCase().includes('cog')) {
      return <LucideIcons.Settings className="h-5 w-5" />;
    }
    if (iconName.toLowerCase().includes('star')) {
      return <LucideIcons.Star className="h-5 w-5" />;
    }
    if (iconName.toLowerCase().includes('heart')) {
      return <LucideIcons.Heart className="h-5 w-5" />;
    }
    if (iconName.toLowerCase().includes('mail') || iconName.toLowerCase().includes('email')) {
      return <LucideIcons.Mail className="h-5 w-5" />;
    }
    
    // Fallback para ícones não encontrados
    console.log(`Ícone não encontrado: ${iconName}, usando CircleDot como fallback`);
    return <LucideIcons.CircleDot className="h-5 w-5" />;
  } catch (error) {
    console.error(`Erro ao renderizar ícone: ${iconName}`, error);
    return <LucideIcons.HelpCircle className="h-5 w-5" />;
  }
};

export function FeaturesSection({
  title,
  subtitle,
  items,
  backgroundColor = '#ffffff',
  textColor = '#1e293b'
}: FeaturesSectionProps) {
  return (
    <section 
      className="py-16 px-4 md:px-6 lg:px-8"
      style={{ 
        backgroundColor: backgroundColor,
        color: textColor
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
            {title}
          </h2>
          
          {subtitle && (
            <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto" style={{ color: textColor }}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Card key={index} className="border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {item.icon && (
                    <span className="text-primary text-xl">
                      {renderIcon(item.icon)}
                    </span>
                  )}
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HtmlContent content={item.content} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
