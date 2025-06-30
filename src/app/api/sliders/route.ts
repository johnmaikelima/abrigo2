import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SliderModel from '@/models/slider';
import { withAdminAuth } from '@/app/api/users/middleware';

// GET - Obter todos os sliders
export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const sliders = await SliderModel.find().sort({ createdAt: -1 }).lean();
      
      return NextResponse.json(sliders, { status: 200 });
    } catch (error) {
      console.error('Erro ao buscar sliders:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar sliders' },
        { status: 500 }
      );
    }
  });
}

// POST - Criar um novo slider
export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (request) => {
    try {
      await connectToDatabase();
      
      const data = await request.json();
      
      // Criar o novo slider
      const newSlider = new SliderModel({
        name: data.name,
        description: data.description,
        width: data.width || '100%',
        height: data.height || '400px',
        interval: data.interval || 5000,
        images: data.images || [],
      });
      
      await newSlider.save();
      
      return NextResponse.json(newSlider, { status: 201 });
    } catch (error) {
      console.error('Erro ao criar slider:', error);
      return NextResponse.json(
        { error: 'Erro ao criar slider' },
        { status: 500 }
      );
    }
  });
}
