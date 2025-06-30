import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import SliderModel from '@/models/slider';
import { withAdminAuth } from '@/app/api/users/middleware';

interface Params {
  params: {
    id: string;
  };
}

// GET - Obter um slider específico
export async function GET(req: NextRequest, { params }: Params) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const slider = await SliderModel.findById(params.id).lean();
      
      if (!slider) {
        return NextResponse.json(
          { error: 'Slider não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(slider, { status: 200 });
    } catch (error) {
      console.error(`Erro ao buscar slider ${params.id}:`, error);
      return NextResponse.json(
        { error: 'Erro ao buscar slider' },
        { status: 500 }
      );
    }
  });
}

// PUT - Atualizar um slider
export async function PUT(req: NextRequest, { params }: Params) {
  return withAdminAuth(req, async (request) => {
    try {
      await connectToDatabase();
      
      const data = await request.json();
      
      const updatedSlider = await SliderModel.findByIdAndUpdate(
        params.id,
        {
          name: data.name,
          description: data.description,
          width: data.width,
          height: data.height,
          interval: data.interval,
          images: data.images,
        },
        { new: true, runValidators: true }
      ).lean();
      
      if (!updatedSlider) {
        return NextResponse.json(
          { error: 'Slider não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedSlider, { status: 200 });
    } catch (error) {
      console.error(`Erro ao atualizar slider ${params.id}:`, error);
      return NextResponse.json(
        { error: 'Erro ao atualizar slider' },
        { status: 500 }
      );
    }
  });
}

// DELETE - Excluir um slider
export async function DELETE(req: NextRequest, { params }: Params) {
  return withAdminAuth(req, async () => {
    try {
      await connectToDatabase();
      
      const deletedSlider = await SliderModel.findByIdAndDelete(params.id).lean();
      
      if (!deletedSlider) {
        return NextResponse.json(
          { error: 'Slider não encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ message: 'Slider excluído com sucesso' }, { status: 200 });
    } catch (error) {
      console.error(`Erro ao excluir slider ${params.id}:`, error);
      return NextResponse.json(
        { error: 'Erro ao excluir slider' },
        { status: 500 }
      );
    }
  });
}
