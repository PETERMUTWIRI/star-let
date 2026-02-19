// app/api/stripe/checkout/products/route.ts - Stripe checkout for merchandise
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';

/* ---------- types ---------- */
interface ProductCheckoutRequest {
  productId: string;
  email: string;
  name: string;
}

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!isStripeConfigured()) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 503 }
      );
    }

    const body: ProductCheckoutRequest = await req.json();
    const { productId, email, name } = body;

    // Validate required fields
    if (!productId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, email, name' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Convert productId to number
    const productIdNum = Number(productId);
    if (isNaN(productIdNum)) {
      return NextResponse.json(
        { error: 'Invalid productId' },
        { status: 400 }
      );
    }

    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productIdNum, published: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const priceInCents = Math.round(product.price.toNumber() * 100);

    // Get base URL from request headers
    const protocol = req.headers.get('x-forwarded-proto') || 'https';
    const host = req.headers.get('host') || req.headers.get('x-forwarded-host');
    const baseUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    // Create or retrieve Stripe price
    let stripePriceId = product.stripePriceId;

    if (!stripePriceId) {
      // Create a new Stripe price for this product
      const stripePrice = await stripe.prices.create({
        unit_amount: priceInCents,
        currency: 'usd',
        product_data: {
          name: product.title,
        },
      });
      stripePriceId = stripePrice.id;

      // Update product with Stripe price ID
      await prisma.product.update({
        where: { id: productIdNum },
        data: {
          stripePriceId,
          stripeProductId: stripePrice.product as string,
        },
      });
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/merchandise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/merchandise`,
      metadata: {
        productId: String(productIdNum),
        customerEmail: email,
        customerName: name,
        productTitle: product.title,
        productPrice: String(priceInCents),
      },
    });

    console.log('Stripe checkout session created for product:', checkoutSession.id);

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
    });
  } catch (error) {
    console.error('POST /api/stripe/checkout/products error:', error);

    if (error instanceof Error && error.message.includes('STRIPE_SECRET_KEY')) {
      return NextResponse.json(
        { error: 'Payment service not configured', message: 'Stripe is not set up' },
        { status: 503 }
      );
    }

    if (error instanceof Error && error.message.includes('stripe')) {
      return NextResponse.json(
        { error: 'Payment service error', message: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}