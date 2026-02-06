// app/api/videos/route.ts - FULL CRUD FOR YOUTUBE VIDEOS
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth/middleware';

/* ---------- validation ---------- */
const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  youtubeId: z.string().min(1, 'YouTube ID is required'),
  category: z.enum(['Music Video', 'Live Performance', 'Interview', 'Behind the Scenes', 'Other']),
  thumbnail: z.string().optional(),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

/* ---------- GET ---------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    // Get single video by ID
    if (id) {
      const video = await prisma.video.findUnique({ 
        where: { id: Number(id), deletedAt: null } 
      });
      return video 
        ? NextResponse.json(video) 
        : NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Build where clause for listing
    const where: any = { deletedAt: null };
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    if (published !== null && published !== undefined) {
      where.published = published === 'true';
    }

    const videos = await prisma.video.findMany({ 
      where, 
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ] 
    });
    
    return NextResponse.json(videos);
  } catch (error) {
    console.error('GET /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' }, 
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
    console.log('POST /api/videos body:', raw);

    // Cast order to number if provided
    if (raw.order !== undefined && raw.order !== null && raw.order !== '') {
      raw.order = Number(raw.order);
    } else {
      raw.order = 0;
    }

    const body = videoSchema.parse(raw);

    const video = await prisma.video.create({
      data: {
        title: body.title,
        description: body.description || null,
        youtubeId: body.youtubeId,
        category: body.category,
        thumbnail: body.thumbnail || null,
        published: body.published,
        order: body.order,
      },
    });

    console.log('Video created:', video.id);
    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      );
    }
    console.error('POST /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to create video' }, 
      { status: 500 }
    );
  }
}

/* ---------- PUT ---------- */
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const idNum = Number(id);
    if (isNaN(idNum)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const raw = await req.json();
    console.log('PUT /api/videos body:', raw);

    // Cast order to number if provided
    if (raw.order !== undefined && raw.order !== null && raw.order !== '') {
      raw.order = Number(raw.order);
    }

    // Partial update schema
    const updateSchema = videoSchema.partial();
    const body = updateSchema.parse(raw);

    // Whitelist only columns that exist in DB
    const data: any = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.description !== undefined) data.description = body.description;
    if (body.youtubeId !== undefined) data.youtubeId = body.youtubeId;
    if (body.category !== undefined) data.category = body.category;
    if (body.thumbnail !== undefined) data.thumbnail = body.thumbnail;
    if (body.published !== undefined) data.published = body.published;
    if (body.order !== undefined) data.order = body.order;

    const updated = await prisma.video.update({ where: { id: idNum }, data });
    console.log('Video updated:', updated.id);
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Validation error', details: error.errors }, 
        { status: 400 }
      );
    }
    console.error('PUT /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to update video' }, 
      { status: 500 }
    );
  }
}

/* ---------- DELETE (Soft Delete) ---------- */
export async function DELETE(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = new URL(req.url).searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const idNum = Number(id);
    if (isNaN(idNum)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await prisma.video.update({ 
      where: { id: idNum }, 
      data: { deletedAt: new Date() } 
    });
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/videos error:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' }, 
      { status: 500 }
    );
  }
}
