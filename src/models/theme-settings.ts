import mongoose, { Schema, Document } from 'mongoose';

export interface IThemeSettings extends Document {
  name: string;
  isDefault: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  header: {
    showLogo: boolean;
    logoUrl: string;
    showNavigation: boolean;
    navigationItems: Array<{
      label: string;
      url: string;
      isExternal: boolean;
    }>;
    sticky: boolean;
    height: number;
  };
  footer: {
    showCopyright: boolean;
    copyrightText: string;
    showSocialLinks: boolean;
    socialLinks: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
    columns: Array<{
      title: string;
      links: Array<{
        label: string;
        url: string;
        isExternal: boolean;
      }>;
    }>;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseFontSize: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ThemeSettingsSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome para o tema'],
      trim: true,
      maxlength: [50, 'O nome não pode ter mais de 50 caracteres'],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    colors: {
      primary: {
        type: String,
        default: '#2563eb',
      },
      secondary: {
        type: String,
        default: '#10b981',
      },
      background: {
        type: String,
        default: '#ffffff',
      },
      text: {
        type: String,
        default: '#111827',
      },
      accent: {
        type: String,
        default: '#f59e0b',
      },
    },
    header: {
      showLogo: {
        type: Boolean,
        default: true,
      },
      logoUrl: {
        type: String,
        default: '/logo.png',
      },
      showNavigation: {
        type: Boolean,
        default: true,
      },
      navigationItems: [
        {
          label: String,
          url: String,
          isExternal: {
            type: Boolean,
            default: false,
          },
        },
      ],
      sticky: {
        type: Boolean,
        default: true,
      },
      height: {
        type: Number,
        default: 80,
      },
    },
    footer: {
      showCopyright: {
        type: Boolean,
        default: true,
      },
      copyrightText: {
        type: String,
        default: '© 2025 Blog. Todos os direitos reservados.',
      },
      showSocialLinks: {
        type: Boolean,
        default: true,
      },
      socialLinks: [
        {
          platform: String,
          url: String,
          icon: String,
        },
      ],
      columns: [
        {
          title: String,
          links: [
            {
              label: String,
              url: String,
              isExternal: {
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      ],
    },
    typography: {
      headingFont: {
        type: String,
        default: 'Inter',
      },
      bodyFont: {
        type: String,
        default: 'Inter',
      },
      baseFontSize: {
        type: Number,
        default: 16,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ThemeSettings || mongoose.model<IThemeSettings>('ThemeSettings', ThemeSettingsSchema);
