// app/tickets/success/page.tsx - Alternative success page at app level
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Registration {
  id: number;
  eventId: number;
  email: string;
  name: string;
  status: string;
  amountPaid: number;
  createdAt: string;
  event: {
    id: number;
    title: string;
    slug: string;
    startDate: string;
    endDate: string | null;
    location: string;
    venue: string | null;
    cover: string | null;
  };
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registration_id');
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRegistration() {
      if (!registrationId) {
        setError('No registration ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/registrations?id=${registrationId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch registration');
        }
        const data = await response.json();
        setRegistration(data);
      } catch (err) {
        setError('Unable to load your registration details');
      } finally {
        setLoading(false);
      }
    }

    fetchRegistration();
  }, [registrationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'We could not find your registration details.'}</p>
          <div className="space-y-3">
            <Link
              href="/events"
              className="block w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/contact"
              className="block w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const eventDate = new Date(registration.event.startDate);
  const isCompleted = registration.status === 'completed';
  const isPending = registration.status === 'pending';
  const isCancelled = registration.status === 'cancelled';

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-800';
    if (isPending) return 'bg-yellow-100 text-yellow-800';
    if (isCancelled) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusMessage = () => {
    if (isCompleted) return {
      icon: (
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      ),
      title: 'Thank You!',
      subtitle: 'Your registration is confirmed',
      bgColor: 'bg-green-500',
    };
    if (isPending) return {
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Payment Pending',
      subtitle: 'Complete your payment to secure your spot',
      bgColor: 'bg-yellow-500',
    };
    if (isCancelled) return {
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      title: 'Registration Cancelled',
      subtitle: 'This registration has been cancelled',
      bgColor: 'bg-red-500',
    };
    return {
      icon: null,
      title: 'Registration Status',
      subtitle: `Status: ${registration.status}`,
      bgColor: 'bg-gray-500',
    };
  };

  const status = getStatusMessage();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Header */}
          <div className={`${status.bgColor} px-6 py-8 text-center`}>
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              {status.icon}
            </div>
            <h1 className="text-3xl font-bold text-white">{status.title}</h1>
            <p className="text-white/80 mt-2">{status.subtitle}</p>
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
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {eventDate.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {registration.event.venue || registration.event.location}
                </p>
              </div>
            </div>

            {/* Ticket Info */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h2>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Ticket ID:</span>{' '}
                  <span className="text-gray-600 font-mono">#{registration.id}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Attendee:</span>{' '}
                  <span className="text-gray-600">{registration.name}</span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Email:</span>{' '}
                  <span className="text-gray-600">{registration.email}</span>
                </p>
                {registration.amountPaid > 0 && (
                  <p className="text-sm">
                    <span className="font-medium text-gray-700">Amount Paid:</span>{' '}
                    <span className="text-gray-600">
                      ${(registration.amountPaid / 100).toFixed(2)}
                    </span>
                  </p>
                )}
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Status:</span>{' '}
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
                    {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-700">Registered:</span>{' '}
                  <span className="text-gray-600">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {isCompleted && (
                <>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.print()}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Ticket
                    </button>
                    <button
                      onClick={() => {
                        // Share functionality
                        if (navigator.share) {
                          navigator.share({
                            title: `My ticket for ${registration.event.title}`,
                            text: `I'm attending ${registration.event.title}!`,
                            url: window.location.href,
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">📧 Email Confirmation:</span> A confirmation email with your ticket has been sent to {registration.email}. Please check your inbox (and spam folder) for details.
                    </p>
                  </div>
                </>
              )}

              {isPending && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">⏳ Complete Your Payment:</span> Your spot is reserved for 15 minutes. Please complete the payment to confirm your registration.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href={`/events/${registration.event.slug}`}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  View Event Details
                </Link>
                <Link
                  href="/events"
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Browse More Events
                </Link>
              </div>

              {isCancelled && (
                <div className="text-center pt-4">
                  <Link
                    href="/contact"
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    Need help? Contact Support
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Add Buttons */}
        {isCompleted && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">Add to your calendar:</p>
            <div className="flex justify-center gap-3">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(registration.event.title)}&dates=${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}/${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}&location=${encodeURIComponent(registration.event.venue || registration.event.location)}&details=${encodeURIComponent(`Your ticket ID: #${registration.id}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Google Calendar
              </a>
              <a
                href={`data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ASUMMARY:${encodeURIComponent(registration.event.title)}%0ADTSTART:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}%0ADTEND:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}%0ALOCATION:${encodeURIComponent(registration.event.venue || registration.event.location)}%0ADESCRIPTION:${encodeURIComponent(`Your ticket ID: #${registration.id}`)}%0AEND:VEVENT%0AEND:VCALENDAR`}
                download={`${registration.event.title}.ics`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                iCal / Outlook
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TicketsSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your ticket...</p>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
