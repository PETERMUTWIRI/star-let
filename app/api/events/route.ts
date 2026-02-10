// app/api/events/route.ts - UPDATED WITH REGISTRATION STATS
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth/middleware';

const prisma = new PrismaClient();

/* ---------- validation ---------- */
const eventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['Upcoming', 'Past']),
  cover: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1),
  endDate: z.string().optional().nullable(),
  author: z.string().optional(),
  metaTitle: z.string().max(100).optional(),
  metaDesc: z.string().max(160).optional(),
  ogImage: z.string().optional(),
  venue: z.string().optional(),
  address: z.string().optional(),
  registrationLink: z.string().optional(),
  maxAttendees: z.number().int().positive().optional(),
  isFree: z.boolean().default(true),
  ticketPrice: z.string().optional(),
  ticketPriceCents: z.number().int().min(0).optional(),
  gallery: z.array(z.string()).max(10).optional(),
});

/* ---------- GET ---------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const slug = searchParams.get('slug');
    const includeStats = searchParams.get('includeStats') === 'true';

    // Get single event by ID
    if (id) {
      const event = await prisma.event.findUnique({
        where: { 
          id: Number(id), 
          deletedAt: null 
        },
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

      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      // Add stats to single event
      const eventWithStats = {
        ...event,
        registrationCount: event.registrations?.length || 0,
        spotsLeft: event.maxAttendees 
          ? event.maxAttendees - (event.registrations?.length || 0) 
          : null,
        isSoldOut: event.maxAttendees 
          ? (event.registrations?.length || 0) >= event.maxAttendees 
          : false,
      };

      return NextResponse.json(eventWithStats);
    }

    // Get single event by slug
    if (slug) {
      const event = await prisma.event.findUnique({
        where: { 
          slug,
          deletedAt: null 
        },
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

      if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      const eventWithStats = {
        ...event,
        registrationCount: event.registrations?.length || 0,
        spotsLeft: event.maxAttendees 
          ? event.maxAttendees - (event.registrations?.length || 0) 
          : null,
        isSoldOut: event.maxAttendees 
          ? (event.registrations?.length || 0) >= event.maxAttendees 
          : false,
      };

      return NextResponse.json(eventWithStats);
    }

    // List events with optional stats
    const where: any = { deletedAt: null };
    if (category && category !== 'All') where.category = category;

    const events = await prisma.event.findMany({
      where,
      orderBy: { startDate: category === 'Past' ? 'desc' : 'asc' },
      include: {
        registrations: {
          where: {
            status: { in: ['pending', 'completed'] },
          },
          select: {
            id: true,
            status: true,
            amountPaid: true,
          },
        },
      },
    });

    // Add registration stats to each event
    const eventsWithStats = events.map(e => ({
      ...e,
      registrationCount: e.registrations.length,
      spotsLeft: e.maxAttendees 
        ? e.maxAttendees - e.registrations.length
        : null,
      isSoldOut: e.maxAttendees 
        ? e.registrations.length >= e.maxAttendees 
        : false,
      // Ticket sales metadata
      ticketSales: includeStats ? {
        totalRevenue: e.registrations.reduce((sum, r) => {
          return r.status === 'completed' ? sum + (r.amountPaid || 0) : sum;
        }, 0),
        pendingRevenue: e.registrations.reduce((sum, r) => {
          return r.status === 'pending' ? sum + (r.amountPaid || 0) : sum;
        }, 0),
        completedCount: e.registrations.filter(r => r.status === 'completed').length,
        pendingCount: e.registrations.filter(r => r.status === 'pending').length,
      } : undefined,
    }));

    return NextResponse.json(eventsWithStats);
  } catch (error) {
    console.error('GET /api/events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

/* ---------- POST ---------- */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const raw = await req.json();
    console.log('POST body:', raw);

    /* ---- cast / clean ---- */
    if (raw.maxAttendees === null || raw.maxAttendees === '') {
      delete raw.maxAttendees;
    } else {
      raw.maxAttendees = Number(raw.maxAttendees);
    }

    if (raw.ticketPriceCents === null || raw.ticketPriceCents === '' || raw.ticketPriceCents === undefined) {
      delete raw.ticketPriceCents;
    } else {
      raw.ticketPriceCents = Number(raw.ticketPriceCents);
    }

    const body = eventSchema.parse(raw);

    const slug = slugify(body.title) + '-' + Date.now();

    const event = await prisma.event.create({
      data: {
        title: body.title,
        slug,
        description: body.description || null,
        category: body.category,
        cover: body.cover || null,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        author: body.author || null,
        metaTitle: body.metaTitle || null,
        metaDesc: body.metaDesc || null,
        ogImage: body.ogImage || null,
        venue: body.venue || null,
        address: body.address || null,
        registrationLink: body.registrationLink || null,
        maxAttendees: body.maxAttendees || null,
        isFree: body.isFree,
        ticketPrice: body.isFree ? null : body.ticketPrice || null,
        ticketPriceCents: body.isFree ? null : body.ticketPriceCents || null,
        gallery: body.gallery || [],
      },
    });

    console.log('Event created:', event.id);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('POST /api/events error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

/* ---------- PUT ---------- */
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const raw = await req.json();
    console.log('PUT /api/events body:', raw);

    // cast maxAttendees and ticketPriceCents before validation
    if (raw.maxAttendees === null || raw.maxAttendees === '') {
      delete raw.maxAttendees;
    } else if (raw.maxAttendees !== undefined) {
      raw.maxAttendees = Number(raw.maxAttendees);
    }

    if (raw.ticketPriceCents === null || raw.ticketPriceCents === '' || raw.ticketPriceCents === undefined) {
      delete raw.ticketPriceCents;
    } else {
      raw.ticketPriceCents = Number(raw.ticketPriceCents);
    }

    // partial update schema
    const updateSchema = eventSchema.partial();
    const body = updateSchema.parse(raw);

    // whitelist ONLY columns that exist in DB
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.category !== undefined) data.category = body.category;
    if (body.cover !== undefined) data.cover = body.cover;
    if (body.location !== undefined) data.location = body.location;
    if (body.startDate !== undefined) data.startDate = new Date(body.startDate);
    if (body.endDate !== undefined) data.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.author !== undefined) data.author = body.author;
    if (body.metaTitle !== undefined) data.metaTitle = body.metaTitle;
    if (body.metaDesc !== undefined) data.metaDesc = body.metaDesc;
    if (body.ogImage !== undefined) data.ogImage = body.ogImage;
    if (body.venue !== undefined) data.venue = body.venue;
    if (body.address !== undefined) data.address = body.address;
    if (body.registrationLink !== undefined) data.registrationLink = body.registrationLink;
    if (body.maxAttendees !== undefined) data.maxAttendees = body.maxAttendees;
    if (body.isFree !== undefined) {
      data.isFree = body.isFree;
      // If event becomes free, clear price fields
      if (body.isFree) {
        data.ticketPrice = null;
        data.ticketPriceCents = null;
      }
    }
    if (body.ticketPrice !== undefined && !body.isFree) data.ticketPrice = body.ticketPrice;
    if (body.ticketPriceCents !== undefined && !body.isFree) data.ticketPriceCents = body.ticketPriceCents;
    if (body.gallery !== undefined) data.gallery = body.gallery;

    const updated = await prisma.event.update({ where: { id }, data });
    console.log('Event updated:', updated.id);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/events error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

/* ---------- DELETE ---------- */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    await prisma.event.update({ 
      where: { id }, 
      data: { deletedAt: new Date() } 
    });
    
    console.log('Event soft deleted:', id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/events error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
