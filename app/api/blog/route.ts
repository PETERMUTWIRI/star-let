// app/api/blog/route.ts - ENTERPRISE VERSION
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { verifyAdminAuth, unauthorizedResponse } from '@/lib/auth/middleware';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

const createSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  category: z.enum(['News','Impact Story','Event Recap','Advocacy','Opinion']),
  cover: z.string().url().optional().nullable(),
  excerpt: z.string().min(10).max(500),
  author: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
  published: z.boolean().optional().default(true),
  publishedAt: z.string().optional().nullable(),
});

/* GET /api/blog */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');

    if (id) {
      const post = await prisma.post.findUnique({
        where: { 
          id: Number(id),
          deletedAt: null,
        },
      });
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    const posts = await prisma.post.findMany({
      where: {
        AND: [
          category && category !== 'All' ? { category } : {},
          { published: true },
          { deletedAt: null },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: limit ? Number(limit) : undefined,
    });
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

/* POST /api/blog */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const body = await req.json();
    const validated = createSchema.parse(body);
    
    const slug = slugify(validated.title);

    const post = await prisma.post.create({
      data: { 
        title: validated.title,
        slug, 
        content: validated.content, 
        category: validated.category, 
        cover: validated.cover || null,
        excerpt: validated.excerpt,
        author: validated.author || null,
        metaTitle: validated.metaTitle || null,
        metaDesc: validated.metaDesc || null,
        ogImage: validated.ogImage || null,
        published: validated.published,
        publishedAt: validated.published ? (validated.publishedAt ? new Date(validated.publishedAt) : new Date()) : null,
      },
    });
    
    // ❌ FIXED: Revalidate blog pages after creating post
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]');
    
    console.log(`[${new Date().toISOString()}] Created post: ${post.title} (published: ${post.published})`);
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('POST /api/blog error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

/* PUT /api/blog */
export async function PUT(req: NextRequest) {
  try {
    const auth = await verifyAdminAuth(req);
    if (!auth.authorized) return unauthorizedResponse();

    const id = Number(req.nextUrl.searchParams.get('id'));
    if (!id) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    const body = await req.json();
    const validated = createSchema.parse(body);

    const post = await prisma.post.update({
      where: { id },
      data: { 
        title: validated.title,
        content: validated.content, 
        category: validated.category, 
        cover: validated.cover || null,
        excerpt: validated.excerpt,
        author: validated.author || null,
        metaTitle: validated.metaTitle || null,
        metaDesc: validated.metaDesc || null,
        ogImage: validated.ogImage || null,
        published: validated.published,
        publishedAt: validated.published ? (validated.publishedAt ? new Date(validated.publishedAt) : new Date()) : null,
      },
    });
    
    // ❌ FIXED: Revalidate blog pages after updating post
    revalidatePath('/blog');
    revalidatePath('/blog/[slug]');
    
    console.log(`[${new Date().toISOString()}] Updated post: ${post.title} (published: ${post.published})`);
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('PUT /api/blog error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);