// app/api/registrations/route.ts - FULL CRUD FOR EVENT REGISTRATIONS
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth/middleware';
import { stripe } from '@/lib/stripe';
import { getBaseUrl } from '@/lib/utils';
import { sendEmail } from '@/lib/email/resend';
import { generateTicketCode } from '@/lib/tickets';

const prisma = new PrismaClient();

/* ---------- validation schemas ---------- */
const registrationSchema = z.object({
  eventId: z.number().int().positive('Event ID is required'),
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required'),
});

const updateSchema = z.object({
  status: z.enum(['pending', 'completed', 'cancelled', 'refunded']).optional(),
  notes: z.string().optional().nullable(),
});

/* ---------- GET - List registrations ---------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    // Get current user session for authorization
    const { session, user } = await import('@neondatabase/auth/next/server').then(m => m.neonAuth());
    const isAdmin = await checkIsAdmin(user);

    // GET /:id - Get single registration
    if (id) {
      const registration = await prisma.registration.findUnique({
        where: { id: Number(id) },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              startDate: true,
              endDate: true,
              location: true,
              venue: true,
              cover: true,
            },
          },
        },
      });

      if (!registration) {
        return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
      }

      // Check authorization: admin or registration owner
      if (!isAdmin && registration.email !== user?.email) {
        return unauthorizedResponse();
      }

      return NextResponse.json(registration);
    }

    // For admin dashboard: return empty array if not admin
    // This allows the dashboard to load even for non-admin users
    if (!isAdmin) {
      return NextResponse.json([]);
    }

    const where: any = {};
    
    if (eventId) {
      where.eventId = Number(eventId);
    }
    
    if (status) {
      where.status = status;
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
            endDate: true,
            location: true,
            venue: true,
            cover: true,
            isFree: true,
            ticketPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('GET /api/registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

/* ---------- POST - Create registration ---------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registrationSchema.parse(body);

    // Get event details
    const event = await prisma.event.findUnique({
      where: { id: validated.eventId },
      include: {
        registrations: {
          where: { status: { in: ['pending', 'completed'] } },
          select: { id: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event is full
    if (event.maxAttendees && event.registrations.length >= event.maxAttendees) {
      return NextResponse.json(
        { error: 'Event is sold out' },
        { status: 400 }
      );
    }

    // Check if user already registered for this event
    const existingRegistration = await prisma.registration.findFirst({
      where: {
        eventId: validated.eventId,
        email: validated.email,
        status: { in: ['pending', 'completed'] },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // For free events: create registration directly
    if (event.isFree) {
      // Generate unique ticket code
      let ticketCode = generateTicketCode();
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        const existing = await prisma.registration.findUnique({
          where: { ticketCode },
        });
        if (!existing) {
          isUnique = true;
        } else {
          ticketCode = generateTicketCode();
          attempts++;
        }
      }

      const registration = await prisma.registration.create({
        data: {
          eventId: validated.eventId,
          email: validated.email,
          name: validated.name,
          status: 'completed',
          amountPaid: 0,
          ticketCode,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
              startDate: true,
              location: true,
              venue: true,
            },
          },
        },
      });

      // Send confirmation email (async, don't wait)
      sendConfirmationEmail(registration).catch(console.error);

      return NextResponse.json(
        {
          ...registration,
          message: 'Registration successful! Check your email for confirmation.',
        },
        { status: 201 }
      );
    }

    // For paid events: create Stripe checkout session
    if (!event.ticketPriceCents || event.ticketPriceCents <= 0) {
      return NextResponse.json(
        { error: 'Invalid ticket price for this event' },
        { status: 400 }
      );
    }

    // Generate unique ticket code (will be activated after payment)
    let ticketCode = generateTicketCode();
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existing = await prisma.registration.findUnique({
        where: { ticketCode },
      });
      if (!existing) {
        isUnique = true;
      } else {
        ticketCode = generateTicketCode();
        attempts++;
      }
    }

    // Create pending registration first
    const registration = await prisma.registration.create({
      data: {
        eventId: validated.eventId,
        email: validated.email,
        name: validated.name,
        status: 'pending',
        amountPaid: event.ticketPriceCents,
        ticketCode,
      },
    });

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: validated.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Ticket: ${event.title}`,
              description: `${event.venue || event.location} - ${new Date(event.startDate).toLocaleDateString()}`,
              images: event.cover ? [event.cover] : undefined,
            },
            unit_amount: event.ticketPriceCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${getBaseUrl()}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}&registration_id=${registration.id}`,
      cancel_url: `${getBaseUrl()}/events/${event.slug}?cancelled=true`,
      metadata: {
        registrationId: String(registration.id),
        eventId: String(event.id),
        eventTitle: event.title,
      },
    });

    // Update registration with Stripe session ID
    await prisma.registration.update({
      where: { id: registration.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return NextResponse.json({
      checkoutUrl: checkoutSession.url,
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('POST /api/registrations error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

/* ---------- PUT - Update registration (admin only) ---------- */
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = updateSchema.parse(body);

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        ...(validated.status && { status: validated.status }),
        ...(validated.notes !== undefined && { notes: validated.notes }),
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    console.log(`[${new Date().toISOString()}] Updated registration: ${registration.id} - status: ${registration.status}`);

    return NextResponse.json(registration);
  } catch (error) {
    console.error('PUT /api/registrations error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

/* ---------- DELETE - Soft delete registration (admin only) ---------- */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) {
      return NextResponse.json(
        { error: 'Registration ID required' },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });

    console.log(`[${new Date().toISOString()}] Cancelled registration: ${id}`);

    return NextResponse.json({
      ok: true,
      message: 'Registration cancelled successfully',
      registrationId: registration.id,
    });
  } catch (error) {
    console.error('DELETE /api/registrations error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel registration' },
      { status: 500 }
    );
  }
}

/* ---------- Helper functions ---------- */
async function checkIsAdmin(user: any): Promise<boolean> {
  if (!user) return false;
  // Check if user has admin role
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });
  return dbUser?.role === 'admin';
}

async function sendConfirmationEmail(registration: any) {
  // Implementation depends on your email service (Resend, SendGrid, etc.)
  // This is a placeholder for the email sending logic
  try {
    await sendEmail({
      to: registration.email,
      subject: `Registration Confirmed: ${registration.event.title}`,
      template: 'event-registration',
      data: {
        name: registration.name,
        eventTitle: registration.event.title,
        eventDate: registration.event.startDate,
        eventLocation: registration.event.venue || registration.event.location,
        registrationId: registration.id,
      },
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
}
