import EventsClient from './EventsClient';

// Server component to fetch events
async function getEvents() {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/events`, {
      // Revalidate every 60 seconds (ISR)
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch events:', res.status);
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export default async function EventsPage() {
  const events = await getEvents();
  
  return <EventsClient initialEvents={events} />;
}
