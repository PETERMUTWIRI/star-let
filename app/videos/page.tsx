import VideosClient from './VideosClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server component to fetch videos from DB
async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      where: { published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    
    // Convert nulls to undefined and dates to strings
    return videos.map((v) => ({
      id: String(v.id),
      title: v.title,
      description: v.description ?? undefined,
      youtubeId: v.youtubeId,
      category: v.category,
      thumbnail: v.thumbnail ?? undefined,
      published: v.published,
      order: v.order,
      createdAt: v.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export default async function VideosPage() {
  const videos = await getVideos();
  return <VideosClient initialVideos={videos} />;
}
