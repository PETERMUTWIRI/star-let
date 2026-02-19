import { prisma } from '@/lib/prisma';
import MerchandiseClient, { Product } from './MerchandiseClient';

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

    console.log('Fetched products:', products.length); // Debug log

    return products.map((product) => {
      try {
        return {
          id: product.id.toString(),
          title: product.title || 'Untitled Product',
          description: product.description,
          price: product.price ? product.price.toNumber() : 0,
          category: product.category || 'Uncategorized',
          image: product.image,
          stripeProductId: product.stripeProductId,
          stripePriceId: product.stripePriceId,
        };
      } catch (error) {
        console.error('Error mapping product:', product.id, error);
        return null;
      }
    }).filter((product): product is Product => product !== null);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function MerchandisePage() {
  const products = await getProducts();

  return <MerchandiseClient initialProducts={products} />;
}