import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  author: z.string().optional(),
  email: z.string().email().optional(),
  postId: z.string().optional(),
  videoId: z.string().optional(),
  musicId: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const videoId = searchParams.get('videoId');
    const musicId = searchParams.get('musicId');

    if (!postId && !videoId && !musicId) {
      return NextResponse.json({ error: 'Missing postId, videoId, or musicId' }, { status: 400 });
    }

    const where: any = { approved: true };
    if (postId) where.postId = parseInt(postId);
    if (videoId) where.videoId = parseInt(videoId);
    if (musicId) where.musicId = parseInt(musicId);

    const comments = await prisma.comment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        content: true,
        author: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = commentSchema.parse(body);

    // Check if at least one ID is provided
    if (!validatedData.postId && !validatedData.videoId && !validatedData.musicId) {
      return NextResponse.json({ error: 'Must provide postId, videoId, or musicId' }, { status: 400 });
    }

    // For now, auto-approve comments, but in production you might want moderation
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.content,
        author: validatedData.author,
        email: validatedData.email,
        postId: validatedData.postId ? parseInt(validatedData.postId) : null,
        videoId: validatedData.videoId ? parseInt(validatedData.videoId) : null,
        musicId: validatedData.musicId ? parseInt(validatedData.musicId) : null,
        approved: true, // Change to false for moderation
      },
    });

    return NextResponse.json({ success: true, comment: { id: comment.id, createdAt: comment.createdAt } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}