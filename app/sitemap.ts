import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://starletmusic.com'

interface SitemapEntry {
  url: string
  lastModified: Date
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content from the database
  const [publishedPosts, upcomingEvents, publishedVideos, publishedMusic] = await Promise.all([
    // Blog posts - only published and not deleted
    prisma.post.findMany({
      where: {
        published: true,
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
    }),

    // Events - not deleted
    prisma.event.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
        startDate: true,
      },
    }),

    // Videos - only published
    prisma.video.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    }),

    // Music tracks - only published and not deleted
    prisma.music.findMany({
      where: {
        published: true,
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ])

  // Static pages with their priorities and change frequencies
  const staticPages: SitemapEntry[] = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/music`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/accessibility`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic blog post pages
  const blogEntries: SitemapEntry[] = publishedPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Dynamic event pages
  const eventEntries: SitemapEntry[] = upcomingEvents.map((event) => ({
    url: `${BASE_URL}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Dynamic video pages
  const videoEntries: SitemapEntry[] = publishedVideos.map((video) => ({
    url: `${BASE_URL}/videos/${video.id}`,
    lastModified: video.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Dynamic music track pages
  const musicEntries: SitemapEntry[] = publishedMusic.map((track) => ({
    url: `${BASE_URL}/music/${track.slug}`,
    lastModified: track.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Combine all entries
  const allEntries: SitemapEntry[] = [
    ...staticPages,
    ...blogEntries,
    ...eventEntries,
    ...videoEntries,
    ...musicEntries,
  ]

  return allEntries
}
