import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://starletmusic.com';
  
  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/music', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/videos', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/events', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/accessibility', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  // Dynamic pages - Events
  let events: { slug: string; updatedAt: Date }[] = [];
  try {
    events = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error('Error fetching events for sitemap:', e);
  }

  // Dynamic pages - Blog Posts
  let posts: { slug: string; updatedAt: Date }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true, deletedAt: null },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error('Error fetching posts for sitemap:', e);
  }

  // Dynamic pages - Music
  let music: { slug: string; updatedAt: Date }[] = [];
  try {
    music = await prisma.music.findMany({
      where: { deletedAt: null, published: true },
      select: { slug: true, updatedAt: true },
    });
  } catch (e) {
    console.error('Error fetching music for sitemap:', e);
  }

  // Dynamic pages - Videos
  let videos: { id: number; updatedAt: Date }[] = [];
  try {
    videos = await prisma.video.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });
  } catch (e) {
    console.error('Error fetching videos for sitemap:', e);
  }

  const now = new Date();

  return [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),

    // Events
    ...events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    // Blog Posts
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Music
    ...music.map((m) => ({
      url: `${baseUrl}/music/${m.slug}`,
      lastModified: m.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),

    // Videos
    ...videos.map((video) => ({
      url: `${baseUrl}/videos/${video.id}`,
      lastModified: video.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
