import mongoose, { Schema, Document } from 'mongoose';

export interface SliderImage {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
}

export interface ISlider extends Document {
  name: string;
  description?: string;
  width: string;
  height: string;
  interval: number; // tempo em ms entre slides
  images: SliderImage[];
  createdAt: Date;
  updatedAt: Date;
}

const SliderSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome para o slider'],
      trim: true,
      maxlength: [100, 'O nome não pode ter mais de 100 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'A descrição não pode ter mais de 500 caracteres'],
    },
    width: {
      type: String,
      required: [true, 'Por favor, especifique a largura do slider'],
      default: '100%',
    },
    height: {
      type: String,
      required: [true, 'Por favor, especifique a altura do slider'],
      default: '400px',
    },
    interval: {
      type: Number,
      required: [true, 'Por favor, especifique o intervalo entre slides'],
      default: 5000, // 5 segundos
    },
    images: [
      {
        imageUrl: {
          type: String,
          required: [true, 'Por favor, adicione uma URL de imagem'],
        },
        title: {
          type: String,
          default: '',
        },
        subtitle: {
          type: String,
          default: '',
        },
        buttonText: {
          type: String,
          default: '',
        },
        buttonLink: {
          type: String,
          default: '',
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Slider || mongoose.model<ISlider>('Slider', SliderSchema);
