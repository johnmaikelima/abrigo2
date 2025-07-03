import mongoose, { Schema } from 'mongoose';

// Definição do esquema para seções de página
const SectionSchema = new Schema({
  type: { type: String, required: true }, // hero, features, testimonials, cta, etc.
  title: { type: String },
  subtitle: { type: String },
  content: { type: String },
  imageUrl: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  backgroundColor: { type: String, default: '#ffffff' },
  textColor: { type: String, default: '#000000' },
  style: { type: String, default: 'default' }, // Estilo da seção (default, carousel, etc.)
  images: [{ type: String }], // Array de URLs de imagens para carrossel
  items: [{ // Para seções com múltiplos itens (cards, features, testimonials)
    title: { type: String },
    subtitle: { type: String },
    content: { type: String },
    imageUrl: { type: String },
    icon: { type: String },
    buttonText: { type: String },
    buttonLink: { type: String }
  }],
  order: { type: Number, default: 0 }
});

// Definição do esquema para páginas
const PageSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String }, // Meta descrição para SEO
  content: { type: String }, // Conteúdo em formato markdown ou HTML
  isAIGenerated: { type: Boolean, default: false },
  sections: [SectionSchema],
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  metaTags: {
    keywords: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    ogImage: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware para atualizar o campo updatedAt antes de salvar
PageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Verificar se o modelo já existe para evitar sobrescrever
const PageModel = mongoose.models.Page || mongoose.model('Page', PageSchema);

export default PageModel;
