import MusicClient from './MusicClient';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server component to fetch music from DB
async function getMusic() {
  try {
    const music = await prisma.music.findMany({
      where: { deletedAt: null, published: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    return music;
  } catch (error) {
    console.error('Error fetching music:', error);
    return [];
  }
}

export default async function MusicPage() {
  const music = await getMusic();
  return <MusicClient music={music} />;
}
