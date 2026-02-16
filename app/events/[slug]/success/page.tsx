// app/events/[slug]/success/page.tsx - Event checkout success handler
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import Link from 'next/link';
import PrintTicketButton from '@/components/PrintTicketButton';

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
  }>;
  params: Promise<{
    slug: string;
  }>;
}

async function verifyAndUpdateRegistration(sessionId: string, registrationId?: string) {
  try {
    // If Stripe is not configured, just look up by registration ID
    if (!isStripeConfigured()) {
      if (!registrationId) {
        return { error: 'Registration not found' };
      }
      
      const registration = await prisma.registration.findUnique({
        where: { id: Number(registrationId) },
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
        return { error: 'Registration not found' };
      }

      return { registration };
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { error: 'Payment not completed' };
    }

    // Find registration by Stripe session ID first
    let registration = await prisma.registration.findFirst({
      where: { stripeSessionId: sessionId },
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

    // If not found by session ID, try by registration ID from metadata
    if (!registration && registrationId) {
      registration = await prisma.registration.findUnique({
        where: { id: Number(registrationId) },
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
    }

    // If still not found, try by metadata in the session
    if (!registration && session.metadata?.registrationId) {
      registration = await prisma.registration.findUnique({
        where: { id: Number(session.metadata.registrationId) },
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
    }

    if (!registration) {
      return { error: 'Registration not found' };
    }

    // Update registration status to completed and store amount paid
    if (registration.status !== 'completed') {
      await prisma.registration.update({
        where: { id: registration.id },
        data: {
          status: 'completed',
          amountPaid: session.amount_total || registration.amountPaid,
          stripeSessionId: sessionId, // Ensure session ID is stored
        },
      });
    }

    return { registration };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { error: 'Failed to verify payment' };
  }
}

async function SuccessContent({ searchParams, params }: SuccessPageProps) {
  const [queryParams, routeParams] = await Promise.all([searchParams, params]);
  const sessionId = queryParams.session_id;
  const registrationId = queryParams.registration_id;
  const { slug } = routeParams;

  // If no session_id, check if there's a registration_id (for free events)
  if (!sessionId && !registrationId) {
    redirect('/events');
  }

  const result = await verifyAndUpdateRegistration(sessionId || '', registrationId);

  if (result.error || !result.registration) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-slate-400 mb-6">{result.error || 'Unable to process your registration'}</p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const { registration } = result;
  const eventDate = new Date(registration.event.startDate);
  const isFree = registration.amountPaid === 0;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-8 text-center border-b border-white/10">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Thank You!</h1>
            <p className="text-slate-300 mt-2">
              {isFree ? 'Your registration is confirmed' : 'Your payment was successful'}
            </p>
          </div>

          {/* Registration Details */}
          <div className="px-6 py-8">
            <div className="border-b border-white/10 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Event Details</h2>
              
              {registration.event.cover && (
                <img
                  src={registration.event.cover}
                  alt={registration.event.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
              )}

              <h3 className="text-xl font-bold text-white mb-2">{registration.event.title}</h3>
              
              <div className="space-y-2 text-slate-400">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {eventDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {eventDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {registration.event.venue || registration.event.location}
                </p>
              </div>
            </div>

            {/* Ticket Code - Prominent Display */}
            {registration.ticketCode && (
              <div className="border-b border-white/10 pb-6 mb-6">
                <h2 className="text-lg font-semibold text-white mb-4">Your Ticket Code</h2>
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl p-6 text-center border border-cyan-500/30">
                  <p className="text-xs text-cyan-400 uppercase tracking-wider mb-2">Present this at the event</p>
                  <p className="text-3xl sm:text-4xl font-black text-white font-mono tracking-wider">
                    NIH-{registration.ticketCode}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">Save this code - it will be emailed to you</p>
                </div>
              </div>
            )}

            {/* Registration Info */}
            <div className="border-b border-white/10 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Registration Information</h2>
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-slate-300">Registration ID:</span>{' '}
                  <span className="text-slate-400 font-mono">#{registration.id}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-slate-300">Name:</span>{' '}
                  <span className="text-slate-400">{registration.name}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-slate-300">Email:</span>{' '}
                  <span className="text-slate-400">{registration.email}</span>
                </p>
                {!isFree && (
                  <p className="text-sm">
                    <span className="font-medium text-slate-300">Amount Paid:</span>{' '}
                    <span className="text-slate-400">
                      ${((registration.amountPaid ?? 0) / 100).toFixed(2)}
                    </span>
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium text-slate-300">Status:</span>{' '}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                    Confirmed
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <PrintTicketButton variant="dark" />
                <Link
                  href={`/events/${registration.event.slug}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  View Event
                </Link>
              </div>

              <p className="text-center text-sm text-slate-500">
                A confirmation email has been sent to {registration.email}
              </p>

              <div className="text-center pt-4">
                <Link
                  href="/events"
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  ← Browse More Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventSuccessPage(props: SuccessPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Confirming your registration...</p>
          </div>
        </div>
      }
    >
      <SuccessContent {...props} />
    </Suspense>
  );
}
