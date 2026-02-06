// app/api/stripe/webhook/route.ts - Handle Stripe webhook events
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('Missing Stripe signature');
    return NextResponse.json(
      { error: 'Missing signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed:', errorMessage);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  console.log('Stripe webhook received:', event.type);

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutExpired(session);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentFailed(paymentIntent);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/* ---------- handlers ---------- */

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { registrationId, eventId, userId } = session.metadata || {};

  if (!registrationId) {
    console.error('No registrationId in session metadata');
    return;
  }

  console.log('Processing completed checkout for registration:', registrationId);

  // Update registration status to completed
  const registration = await prisma.registration.update({
    where: { id: Number(registrationId) },
    data: {
      status: 'completed',
    },
  });

  console.log('Registration marked as completed:', registration.id);

  // TODO: Send confirmation email
  // await sendConfirmationEmail(registration.email, registration.name, eventId);
}

/**
 * Handle expired checkout session
 */
async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
  const { registrationId } = session.metadata || {};
  
  if (!registrationId) {
    console.error('No registrationId in session metadata');
    return;
  }

  console.log('Processing expired checkout for registration:', registrationId);

  // Update registration status to expired
  const registration = await prisma.registration.update({
    where: { id: Number(registrationId) },
    data: {
      status: 'expired',
    },
  });

  console.log('Registration marked as expired:', registration.id);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Find registration by payment intent ID if stored
  const registration = await prisma.registration.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (!registration) {
    console.error('No registration found for payment intent:', paymentIntent.id);
    return;
  }

  console.log('Processing failed payment for registration:', registration.id);

  // Update registration status to failed
  await prisma.registration.update({
    where: { id: registration.id },
    data: {
      status: 'failed',
    },
  });

  console.log('Registration marked as failed:', registration.id);
}

/* ---------- GET (for webhook verification/testing) ---------- */
export async function GET() {
  return NextResponse.json({ 
    status: 'Stripe webhook endpoint active',
    timestamp: new Date().toISOString(),
  });
}
