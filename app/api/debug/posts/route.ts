// In your admin panel, when you save a post, make sure published is set to true
// Check the database directly:

// Add this temporary route to check your data
// app/api/debug/posts/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      published: true,
      publishedAt: true,
      deletedAt: true,
      category: true,
    },
    orderBy: { id: 'desc' },
  });
  
  return NextResponse.json(posts);
}