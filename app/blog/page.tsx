// app/blog/page.tsx - ENTERPRISE SINGLE-PAGE CACHE + REVALIDATION
import { PrismaClient } from '@prisma/client';
import BlogClient from './BlogClient';
import { unstable_cache } from 'next/cache';
import { revalidatePath } from 'next/cache';
import type { Metadata } from 'next';
import { MusicGroupSchema, ArticleSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Blog & Stories | Ray Armillion',
  description: 'Read inspiring stories, impact narratives, and updates from Ray Armillion. Discover the journey of faith, music, and community transformation.',
  keywords: ['blog', 'stories', 'inspiration', 'faith', 'testimony', 'community', 'impact'],
  openGraph: {
    title: 'Blog & Stories | Ray Armillion',
    description: 'Read inspiring stories and updates from Ray Armillion.',
    type: 'website',
    url: 'https://starletmusic.com/blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ray Armillion Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Stories | Ray Armillion',
    description: 'Read inspiring stories and updates from Ray Armillion.',
  },
  alternates: {
    canonical: 'https://starletmusic.com/blog',
  },
};

/* ---------- prisma singleton ---------- */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const getPrisma = () => {
  if (process.env.NODE_ENV === 'production') return new PrismaClient();
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma!;
};

/* ---------- cached db read ---------- */
const getCachedPosts = unstable_cache(
  async () => {
    const prisma = getPrisma();
    const rows = await prisma.post.findMany({
      where: {
        published: true,
        deletedAt: null,
        publishedAt: { not: null, lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
    });

    return rows.map((p) => ({
      ...p,
      publishedAt: p.publishedAt!.toISOString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      excerpt: p.excerpt || p.content.slice(0, 200).replace(/<[^>]*>/g, ''),
    }));
  },
  ['blog-posts'],
  { revalidate: 60, tags: ['blog-posts'] }
);

/* ---------- server component ---------- */
export default async function BlogPage() {
  const posts = await getCachedPosts();
  const latestPost = posts[0];
  
  if (posts.length === 0)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No published posts available</h2>
          <p className="text-gray-600 mb-4">There are no published posts to display.</p>
          <p className="text-sm text-gray-500">Check admin panel to publish your first post</p>
        </div>
      </div>
    );

  return (
    <>
      <MusicGroupSchema />
      {latestPost && (
        <ArticleSchema
          headline={latestPost.title}
          description={latestPost.excerpt}
          image={latestPost.cover || undefined}
          datePublished={latestPost.publishedAt}
          dateModified={latestPost.updatedAt}
          author={latestPost.author || 'Ray Armillion'}
          category={latestPost.category}
          slug={latestPost.slug}
        />
      )}
      <BlogClient initialPosts={posts} />
    </>
  );
}

/* ---------- manual revalidation helper (for api calls) ---------- */
export async function revalidateBlog() {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]');
}
