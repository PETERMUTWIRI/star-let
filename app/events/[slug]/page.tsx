import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EventSchema, BreadcrumbSchema } from '@/components/StructuredData';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaCalendar, 
  FaClock, 
  FaMapMarkerAlt, 
  FaArrowLeft, 
  FaTicketAlt,
  FaUsers,
  FaCheckCircle,
  FaExternalLinkAlt
} from 'react-icons/fa';
import EventTicketForm from './EventTicketForm';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const event = await prisma.event.findUnique({
    where: { slug, deletedAt: null },
    include: {
      registrations: {
        where: { status: { in: ['pending', 'completed'] } },
        select: { id: true },
      },
    },
  });

  if (!event) {
    return {
      title: 'Event Not Found | Ray Armillion',
    };
  }

  const description = event.description || `Join Ray Armillion at ${event.title}. ${event.location}`;
  const imageUrl = event.cover || '/og-image.jpg';
  const isSoldOut = event.maxAttendees 
    ? event.registrations.length >= event.maxAttendees 
    : false;

  return {
    title: `${event.title} | Ray Armillion Events`,
    description,
    keywords: [event.category, 'Ray Armillion', 'gospel concert', 'live performance', event.location],
    openGraph: {
      title: event.title,
      description: isSoldOut ? 'SOLD OUT - ' + description : description,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/events/${slug}`,
    },
  };
}

// Generate static params for popular events
export async function generateStaticParams() {
  const events = await prisma.event.findMany({
    where: { deletedAt: null },
    select: { slug: true },
    take: 20,
  });

  return events.map((event) => ({
    slug: event.slug,
  }));
}

// Fetch upcoming events for sidebar
async function getUpcomingEvents(currentSlug: string) {
  const now = new Date();
  return await prisma.event.findMany({
    where: {
      deletedAt: null,
      slug: { not: currentSlug },
      startDate: { gte: now },
    },
    orderBy: { startDate: 'asc' },
    take: 3,
    include: {
      registrations: {
        where: { status: { in: ['pending', 'completed'] } },
        select: { id: true },
      },
    },
  });
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  
  const event = await prisma.event.findUnique({
    where: { slug, deletedAt: null },
    include: {
      registrations: {
        where: { status: { in: ['pending', 'completed'] } },
        select: { id: true, status: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const upcomingEvents = await getUpcomingEvents(slug);
  
  const registrationCount = event.registrations.length;
  const isSoldOut = event.maxAttendees 
    ? registrationCount >= event.maxAttendees 
    : false;
  const spotsLeft = event.maxAttendees 
    ? event.maxAttendees - registrationCount 
    : null;

  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(event.startDate).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const isPastEvent = new Date(event.startDate) < new Date();

  return (
    <>
      <EventSchema
        name={event.title}
        description={event.description || undefined}
        image={event.cover || undefined}
        startDate={event.startDate.toISOString()}
        endDate={event.endDate?.toISOString()}
        location={{
          name: event.venue || event.location,
          address: event.address || event.location,
        }}
        offers={event.isFree ? undefined : {
          price: event.ticketPrice || '0',
          priceCurrency: 'USD',
          availability: isSoldOut ? 'SoldOut' : 'InStock',
          url: `https://www.staramillion.com/events/${slug}`,
        }}
        eventStatus={isPastEvent ? 'EventScheduled' : 'EventScheduled'}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Events', path: '/events' },
          { name: event.title, path: `/events/${slug}` },
        ]}
      />

      <div className="relative min-h-screen bg-slate-950">
        {/* Hero Section */}
        <header className="relative pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Back Link */}
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Events
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Image & Quick Info */}
              <div>
                {/* Category Badge */}
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
                  {event.category}
                </span>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  {event.title}
                </h1>

                {/* Cover Image */}
                {event.cover && (
                  <div className="relative aspect-video rounded-2xl overflow-hidden glow-mixed mb-6">
                    <Image
                      src={event.cover}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-3xl font-bold text-red-500">SOLD OUT</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Info Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <FaCalendar className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-sm text-slate-400">Date</p>
                      <p className="text-white font-medium">{formattedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <FaClock className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-sm text-slate-400">Time</p>
                      <p className="text-white font-medium">{formattedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <FaMapMarkerAlt className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-sm text-slate-400">Location</p>
                      <p className="text-white font-medium">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <FaUsers className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-sm text-slate-400">Attendees</p>
                      <p className="text-white font-medium">
                        {registrationCount}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Ticket Form */}
              <div className="lg:sticky lg:top-24">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  {isPastEvent ? (
                    <div className="text-center py-8">
                      <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-2">Event Completed</h2>
                      <p className="text-slate-400">This event has already taken place.</p>
                      <Link 
                        href="/events" 
                        className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                      >
                        View Upcoming Events
                      </Link>
                    </div>
                  ) : event.registrationType === 'external' && event.registrationLink ? (
                    <div className="text-center py-8">
                      <FaExternalLinkAlt className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-2">External Registration</h2>
                      <p className="text-slate-400 mb-6">This event requires registration through an external platform.</p>
                      <a 
                        href={event.registrationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/25 transition-all"
                      >
                        Register Now
                        <FaExternalLinkAlt className="w-4 h-4" />
                      </a>
                    </div>
                  ) : isSoldOut ? (
                    <div className="text-center py-8">
                      <FaTicketAlt className="w-16 h-16 text-red-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-white mb-2">Sold Out</h2>
                      <p className="text-slate-400">All tickets have been sold for this event.</p>
                    </div>
                  ) : (
                    <EventTicketForm 
                      eventId={event.id}
                      eventSlug={slug}
                      isFree={event.isFree || false}
                      ticketPrice={event.ticketPrice}
                      ticketPriceCents={event.ticketPriceCents || 0}
                      spotsLeft={spotsLeft}
                      eventTitle={event.title}
                    />
                  )}
                </div>

                {/* Spots Left Indicator */}
                {!isPastEvent && !isSoldOut && spotsLeft !== null && spotsLeft <= 10 && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
                    <p className="text-red-400 font-semibold">
                      Only {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Description Section */}
        {event.description && (
          <section className="py-12 px-4 sm:px-6 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">About This Event</h2>
              <div 
                className="prose prose-invert prose-lg max-w-none prose-p:text-slate-300"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </section>
        )}

        {/* Venue Info */}
        {(event.venue || event.address) && (
          <section className="py-12 px-4 sm:px-6 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Venue Information</h2>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                {event.venue && (
                  <p className="text-lg text-white font-medium mb-2">{event.venue}</p>
                )}
                {event.address && (
                  <p className="text-slate-400">{event.address}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="py-16 px-4 sm:px-6 border-t border-white/10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8">More Upcoming Events</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {upcomingEvents.map((evt) => (
                  <Link
                    key={evt.id}
                    href={`/events/${evt.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                      <Image
                        src={evt.cover || '/og-image.jpg'}
                        alt={evt.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {evt.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      {new Date(evt.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
