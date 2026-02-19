import { prisma } from '@/lib/prisma';
import MerchandiseClient from './MerchandiseClient';

export const metadata = {
  title: 'Merchandise | Ray Armillion',
  description: 'Official merchandise store - T-shirts, caps, and Maasai-inspired apparel. Support the artist and show your love for Kenyan gospel music.',
};

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    return products.map((product) => ({
      id: product.id.toString(),
      title: product.title,
      description: product.description,
      price: product.price.toNumber(),
      category: product.category,
      image: product.image,
      stripeProductId: product.stripeProductId,
      stripePriceId: product.stripePriceId,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function MerchandisePage() {
  const products = await getProducts();

  return <MerchandiseClient initialProducts={products} />;
}