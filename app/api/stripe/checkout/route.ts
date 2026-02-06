// app/api/stripe/checkout/route.ts - Stripe checkout for event tickets
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { neonAuth } from '@neondatabase/auth/next/server';

/* ---------- types ---------- */
interface CheckoutRequest {
  eventId: string;
  email: string;
  name: string;
}

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  try {
    // Verify user authentication for purchases
    const { session, user } = await neonAuth();
    if (!session || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: CheckoutRequest = await req.json();
    const { eventId, email, name } = body;

    // Validate required fields
    if (!eventId || !email || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, email, name' },
        { status: 400 }
      );
    }

    // Convert eventId to number
    const eventIdNum = Number(eventId);
    if (isNaN(eventIdNum)) {
      return NextResponse.json(
        { error: 'Invalid eventId' },
        { status: 400 }
      );
    }

    // Fetch the event
    const event = await prisma.event.findUnique({
      where: { id: eventIdNum, deletedAt: null },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if registration is still open
    if (event.startDate && new Date(event.startDate) < new Date()) {
      return NextResponse.json(
        { error: 'Registration is closed for this event' },
        { status: 400 }
      );
    }

    // Check max attendees
    if (event.maxAttendees) {
      const registrationCount = await prisma.registration.count({
        where: { 
          eventId: eventIdNum, 
          status: { in: ['pending', 'completed'] } 
        },
      });
      
      if (registrationCount >= event.maxAttendees) {
        return NextResponse.json(
          { error: 'Event is sold out' },
          { status: 400 }
        );
      }
    }

    const isFreeEvent = event.isFree || !event.ticketPriceCents || event.ticketPriceCents === 0;
    const priceInCents = event.ticketPriceCents || 0;

    // For free events, create registration immediately without Stripe
    if (isFreeEvent) {
      const registration = await prisma.registration.create({
        data: {
          eventId: eventIdNum,
          email,
          name,
          amountPaid: 0,
          status: 'completed',
        },
      });

      return NextResponse.json({
        success: true,
        isFree: true,
        registrationId: registration.id,
        message: 'Registration successful for free event',
      });
    }

    // For paid events, create Stripe checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // Create or retrieve Stripe price
    let stripePriceId = event.stripePriceId;
    
    if (!stripePriceId) {
      // Create a new Stripe price for this event
      const stripePrice = await stripe.prices.create({
        unit_amount: priceInCents,
        currency: 'usd',
        product_data: {
          name: event.title,
          description: `Ticket for ${event.title}`,
        },
      });
      stripePriceId = stripePrice.id;

      // Update event with Stripe price ID
      await prisma.event.update({
        where: { id: eventIdNum },
        data: { 
          stripePriceId,
          stripeProductId: stripePrice.product as string,
        },
      });
    }

    // Create pending registration
    const registration = await prisma.registration.create({
      data: {
        eventId: eventIdNum,
        email,
        name,
        amountPaid: priceInCents,
        status: 'pending',
      },
    });

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
      success_url: `${baseUrl}/events/${eventId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/events/${eventId}/cancel`,
      metadata: {
        registrationId: registration.id,
        eventId,
        userId: user.id,
      },
    });

    // Update registration with Stripe session ID
    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    console.log('Stripe checkout session created:', checkoutSession.id);

    return NextResponse.json({
      success: true,
      isFree: false,
      checkoutUrl: checkoutSession.url,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('POST /api/stripe/checkout error:', error);
    
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
