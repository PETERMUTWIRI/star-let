import EventsClient from './EventsClient';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering to get fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  return <EventsClient initialEvents={events} />;
}
