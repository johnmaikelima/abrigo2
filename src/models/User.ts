import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface para o documento do usuário
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
  createdAt: Date;
  updatedAt: Date;
}

// Esquema do usuário
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'editor', 'author'],
      default: 'author',
    },
  },
  {
    timestamps: true,
  }
);

// Criar o modelo se ainda não existir
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export type { IUser };
export { UserModel };

