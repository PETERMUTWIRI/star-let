// app/api/stripe/success/page.tsx - Stripe checkout success handler
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { stripe } from '@/lib/stripe';
import Link from 'next/link';

const prisma = new PrismaClient();

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
    registration_id?: string;
  }>;
}

async function verifyAndUpdateRegistration(sessionId: string, registrationId?: string) {
  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return { error: 'Payment not completed' };
    }

    // Find registration by Stripe session ID or registration ID
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { stripeSessionId: sessionId },
          ...(registrationId ? [{ id: Number(registrationId) }] : []),
        ],
      },
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

    // Update registration status to completed
    if (registration.status !== 'completed') {
      await prisma.registration.update({
        where: { id: registration.id },
        data: {
          status: 'completed',
          amountPaid: session.amount_total || registration.amountPaid,
        },
      });
    }

    return { registration };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return { error: 'Failed to verify payment' };
  }
}

async function SuccessContent({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const registrationId = params.registration_id;

  if (!sessionId) {
    redirect('/events');
  }

  const result = await verifyAndUpdateRegistration(sessionId, registrationId);

  if (result.error || !result.registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{result.error || 'Unable to process your registration'}</p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    );
  }

  const { registration } = result;
  const eventDate = new Date(registration.event.startDate);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-500 px-6 py-8 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Thank You!</h1>
            <p className="text-green-100 mt-2">Your registration is confirmed</p>
          </div>

          {/* Registration Details */}
          <div className="px-6 py-8">
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h2>
              
              {registration.event.cover && (
                <img
                  src={registration.event.cover}
                  alt={registration.event.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <h3 className="text-xl font-bold text-gray-900 mb-2">{registration.event.title}</h3>
              
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {eventDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {registration.event.venue || registration.event.location}
                </p>
              </div>
            </div>

            {/* Registration Info */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Registration Information</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Registration ID:</span>{' '}
                  <span className="text-gray-600 font-mono">#{registration.id}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Name:</span>{' '}
                  <span className="text-gray-600">{registration.name}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span>{' '}
                  <span className="text-gray-600">{registration.email}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Amount Paid:</span>{' '}
                  <span className="text-gray-600">
                    ${((registration.amountPaid ?? 0) / 100).toFixed(2)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Status:</span>{' '}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Confirmed
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Ticket
                </button>
                <Link
                  href={`/events/${registration.event.slug}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  View Event Details
                </Link>
              </div>

              <p className="text-center text-sm text-gray-500">
                A confirmation email has been sent to {registration.email}
              </p>

              <div className="text-center pt-4">
                <Link
                  href="/events"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
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

export default function StripeSuccessPage(props: SuccessPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Confirming your registration...</p>
          </div>
        </div>
      }
    >
      <SuccessContent {...props} />
    </Suspense>
  );
}
