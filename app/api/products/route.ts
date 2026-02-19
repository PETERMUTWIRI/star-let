import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { stripe, isStripeConfigured } from '@/lib/stripe';

const productSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  image: z.string().optional(),
  published: z.boolean().default(true),
  order: z.number().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = { published: true };
    if (category && category !== 'All') {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = productSchema.parse(body);

    // Create product in database first
    const product = await prisma.product.create({
      data: validatedData,
    });

    // Generate Stripe product and price if Stripe is configured
    if (isStripeConfigured()) {
      try {
        const priceInCents = Math.round(validatedData.price * 100);

        // Create Stripe product
        const stripeProduct = await stripe.products.create({
          name: validatedData.title,
          description: validatedData.description || undefined,
          images: validatedData.image ? [validatedData.image] : undefined,
        });

        // Create Stripe price
        const stripePrice = await stripe.prices.create({
          unit_amount: priceInCents,
          currency: 'usd',
          product: stripeProduct.id,
        });

        // Update product with Stripe IDs
        await prisma.product.update({
          where: { id: product.id },
          data: {
            stripeProductId: stripeProduct.id,
            stripePriceId: stripePrice.id,
          },
        });

        console.log('Stripe product and price created for product:', product.id);
      } catch (stripeError) {
        console.error('Error creating Stripe product/price:', stripeError);
        // Don't fail the product creation if Stripe fails
      }
    }

    // Fetch the updated product with Stripe IDs
    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}