import VideosClient from './VideosClient';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { MusicGroupSchema } from '@/components/StructuredData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Videos | Ray Armillion',
  description: 'Watch official music videos, live performances, behind-the-scenes footage, and worship sessions from Ray Armillion on YouTube.',
  keywords: ['music videos', 'live performances', 'youtube', 'behind the scenes', 'worship videos', 'gospel videos'],
  openGraph: {
    title: 'Videos | Ray Armillion',
    description: 'Watch official music videos, live performances, and behind-the-scenes footage.',
    type: 'video.other',
    url: 'https://www.staramillion.com/videos',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ray Armillion Videos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Videos | Ray Armillion',
    description: 'Watch official music videos and live performances.',
  },
  alternates: {
    canonical: 'https://www.staramillion.com/videos',
  },
};

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
  
  return (
    <>
      <MusicGroupSchema />
      <VideosClient initialVideos={videos} />
    </>
  );
}
