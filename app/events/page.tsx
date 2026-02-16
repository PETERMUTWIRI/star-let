import EventsClient from './EventsClient';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { EventSchema, MusicGroupSchema } from '@/components/StructuredData';

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Events & Concerts | Ray Armillion',
  description: 'See Ray Armillion live! View upcoming concerts, worship nights, and community events. Get tickets and experience the energy of Kenyan-American gospel music.',
  keywords: ['concerts', 'live events', 'gospel concerts', 'worship nights', 'tour dates', 'tickets', 'performances'],
  openGraph: {
    title: 'Events & Concerts | Ray Armillion',
    description: 'See Ray Armillion live! View upcoming concerts, worship nights, and community events. Get tickets now.',
    type: 'website',
    url: 'https://starletmusic.com/events',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ray Armillion Live Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events & Concerts | Ray Armillion',
    description: 'See Ray Armillion live! View upcoming concerts and get tickets.',
  },
  alternates: {
    canonical: 'https://starletmusic.com/events',
  },
};

// Server component to fetch events directly from DB
async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      orderBy: { startDate: 'asc' },
      include: {
        registrations: {
          where: {
            status: { in: ['pending', 'completed'] },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Add computed fields and convert nulls to undefined
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description ?? undefined,
      category: e.category,
      cover: e.cover ?? undefined,
      location: e.location,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString(),
      venue: e.venue ?? undefined,
      address: e.address ?? undefined,
      registrationLink: e.registrationLink ?? undefined,
      maxAttendees: e.maxAttendees ?? undefined,
      isFree: e.isFree ?? true,
      ticketPrice: e.ticketPrice ?? undefined,
      ticketPriceCents: e.ticketPriceCents ?? undefined,
      gallery: e.gallery as string[] | undefined,
      registrationCount: e.registrations.length,
      spotsLeft: e.maxAttendees ? e.maxAttendees - e.registrations.length : null,
      isSoldOut: e.maxAttendees ? e.registrations.length >= e.maxAttendees : false,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.startDate) >= now).slice(0, 5);

  return (
    <>
      <MusicGroupSchema />
      {upcomingEvents.map((event) => (
        <EventSchema
          key={event.id}
          name={event.title}
          description={event.description}
          image={event.cover}
          startDate={event.startDate}
          endDate={event.endDate}
          location={{
            name: event.venue,
            address: event.address,
            city: event.location,
          }}
          offers={event.isFree ? undefined : {
            price: event.ticketPriceCents ? String(event.ticketPriceCents / 100) : '0',
            priceCurrency: 'USD',
            availability: event.isSoldOut ? 'SoldOut' : 'InStock',
            url: event.registrationLink,
          }}
          eventStatus={event.isSoldOut ? 'EventScheduled' : 'EventScheduled'}
        />
      ))}
      <EventsClient initialEvents={events} />
    </>
  );
}
