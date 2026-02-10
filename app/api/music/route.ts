// app/api/music/route.ts - Music Management API
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth/middleware';

/* ---------- validation ---------- */
const musicSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['Single', 'Album', 'Live Performance', 'Cover', 'Reel/Short', 'Worship', 'Music Video']),
  youtubeUrl: z.string().min(1, 'YouTube URL is required'),
  youtubeId: z.string().min(1, 'YouTube ID is required'),
  thumbnail: z.string().optional(),
  useCustomThumbnail: z.boolean().default(false),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
});

/* ---------- Helper: Extract YouTube ID from URL ---------- */
function extractYouTubeId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

/* ---------- GET ---------- */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    // Get single music by ID
    if (id) {
      const music = await prisma.music.findUnique({
        where: { id: Number(id), deletedAt: null },
      });

      if (!music) {
        return NextResponse.json({ error: 'Music not found' }, { status: 404 });
      }

      return NextResponse.json(music);
    }

    // List music
    const where: any = { deletedAt: null };
    if (category && category !== 'All') where.category = category;

    const music = await prisma.music.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(music);
  } catch (error) {
    console.error('GET /api/music error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch music' },
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

    // Extract YouTube ID if not provided
    if (!raw.youtubeId && raw.youtubeUrl) {
      raw.youtubeId = extractYouTubeId(raw.youtubeUrl);
    }

    if (!raw.youtubeId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Auto-generate thumbnail if not using custom thumbnail
    if (!raw.useCustomThumbnail && !raw.thumbnail) {
      raw.thumbnail = getYouTubeThumbnail(raw.youtubeId);
    }

    const body = musicSchema.parse(raw);
    const slug = slugify(body.title) + '-' + Date.now();

    const music = await prisma.music.create({
      data: {
        ...body,
        slug,
      },
    });

    return NextResponse.json(music, { status: 201 });
  } catch (error) {
    console.error('POST /api/music error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create music entry' },
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

    // Extract YouTube ID if URL changed and ID not provided
    if (raw.youtubeUrl && !raw.youtubeId) {
      raw.youtubeId = extractYouTubeId(raw.youtubeUrl);
    }

    if (raw.youtubeId === null) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    // Auto-generate thumbnail if not using custom thumbnail
    if (raw.youtubeId && !raw.useCustomThumbnail && !raw.thumbnail) {
      raw.thumbnail = getYouTubeThumbnail(raw.youtubeId);
    }

    const updateSchema = musicSchema.partial();
    const body = updateSchema.parse(raw);

    const updated = await prisma.music.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/music error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update music entry' },
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

    await prisma.music.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('DELETE /api/music error:', error);
    return NextResponse.json(
      { error: 'Failed to delete music entry' },
      { status: 500 }
    );
  }
}
