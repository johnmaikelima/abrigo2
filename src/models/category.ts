import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome da categoria é obrigatório'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'O slug da categoria é obrigatório'],
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Verificar se o modelo já existe antes de criar um novo
export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
