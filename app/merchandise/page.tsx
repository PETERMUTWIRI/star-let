import { prisma } from '@/lib/prisma';
import MerchandiseClient, { Product } from './MerchandiseClient';

import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Merchandise | Ray Armillion',
  description: 'Shop official Ray Armillion merchandise. T-shirts, caps, and Maasai-inspired apparel. Support the artist and show your love for Kenyan gospel music. Worldwide shipping available.',
  keywords: ['Ray Armillion', 'merchandise', 't-shirts', 'apparel', 'gospel music merch', 'Kenyan artist', 'Maasai inspired', 'official store'],
  openGraph: {
    title: 'Official Merchandise | Ray Armillion',
    description: 'Shop official Ray Armillion merchandise. T-shirts, caps, and Maasai-inspired apparel.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ray Armillion Official Merchandise',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Official Merchandise | Ray Armillion',
    description: 'Shop official Ray Armillion merchandise.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/merchandise',
  },
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

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Merchandise', path: '/merchandise' },
        ]}
      />
      <MerchandiseClient initialProducts={products} />
    </>
  );
}