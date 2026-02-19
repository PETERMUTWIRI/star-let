import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditProductForm from './EditProductForm';

interface PageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product) {
    notFound();
  }

  return (
    <EditProductForm
      product={{
        id: product.id,
        title: product.title,
        description: product.description || '',
        price: product.price.toNumber(),
        category: product.category,
        image: product.image || '',
        published: product.published,
      }}
    />
  );
}