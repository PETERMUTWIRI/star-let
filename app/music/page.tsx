import MusicClient from './MusicClient';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import { MusicGroupSchema, MusicAlbumSchema } from '@/components/StructuredData';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Music | Rahab Kinity',
  description: 'Stream Rahab Kinity\'s latest gospel music, worship songs, and live performances. Experience soulful melodies that inspire hope and faith.',
  keywords: ['gospel music', 'christian music', 'worship songs', 'kenyan artist', 'praise music', 'live performance'],
  openGraph: {
    title: 'Music | Rahab Kinity',
    description: 'Stream the latest gospel music, worship songs, and live performances. Experience soulful melodies that inspire hope.',
    type: 'music.playlist',
    url: 'https://starletmusic.com/music',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Rahab Kinity Music',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Music | Rahab Kinity',
    description: 'Stream the latest gospel music and worship songs.',
  },
  alternates: {
    canonical: 'https://starletmusic.com/music',
  },
};

// Server component to fetch music from DB
async function getMusic() {
  try {
    const music = await prisma.music.findMany({
      where: { deletedAt: null, published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    
    // Convert nulls to undefined and dates to strings
    return music.map((m) => ({
      id: m.id,
      title: m.title,
      slug: m.slug,
      description: m.description ?? undefined,
      category: m.category,
      youtubeUrl: m.youtubeUrl,
      youtubeId: m.youtubeId,
      thumbnail: m.thumbnail ?? undefined,
      order: m.order,
      createdAt: m.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching music:', error);
    return [];
  }
}

export default async function MusicPage() {
  const music = await getMusic();
  
  return (
    <>
      <MusicGroupSchema />
      {music.slice(0, 3).map((m) => (
        <MusicAlbumSchema
          key={m.id}
          name={m.title}
          description={m.description}
          image={m.thumbnail}
          datePublished={m.createdAt}
          genre={['Gospel', m.category === 'Worship' ? 'Christian Worship' : 'Contemporary Christian']}
        />
      ))}
      <MusicClient music={music} />
    </>
  );
}
