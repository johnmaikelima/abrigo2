import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import PageModel from '@/models/page';
import { PageRenderer } from '@/components/page-sections/page-renderer';
import { serializeMongoDBObject } from '@/lib/mongodb-helpers';

interface PageProps {
  params: {
    slug: string;
  };
}

// Gerar metadados dinâmicos para SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await connectToDatabase();
  const page = await PageModel.findOne({ slug: params.slug, isPublished: true }).lean();
  
  if (!page) {
    return {
      title: 'Página não encontrada',
    };
  }
  
  // Serializar o objeto do MongoDB para metadados
  const serializedPage = serializeMongoDBObject(page);
  
  return {
    title: serializedPage.title,
    description: serializedPage.description || serializedPage.metaTags?.description,
    keywords: serializedPage.metaTags?.keywords,
    openGraph: {
      title: serializedPage.metaTags?.ogTitle || serializedPage.title,
      description: serializedPage.metaTags?.ogDescription || serializedPage.description,
      images: serializedPage.metaTags?.ogImage ? [serializedPage.metaTags.ogImage] : [],
    },
  };
}

export default async function DynamicPage({ params }: PageProps) {
  await connectToDatabase();
  const page = await PageModel.findOne({ slug: params.slug, isPublished: true }).lean();
  
  if (!page) {
    notFound();
  }
  
  // Serializar o objeto do MongoDB antes de passar para componentes React
  const serializedPage = serializeMongoDBObject(page);
  
  return (
    <main>
      <PageRenderer sections={serializedPage.sections || []} />
    </main>
  );
}
