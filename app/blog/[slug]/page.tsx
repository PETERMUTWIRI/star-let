import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ArticleSchema, BreadcrumbSchema } from '@/components/StructuredData';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaUser, FaArrowLeft, FaShare } from 'react-icons/fa';

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug, published: true, deletedAt: null },
  });

  if (!post) {
    return {
      title: 'Post Not Found | Ray Armillion',
    };
  }

  const description = post.excerpt || post.content.slice(0, 160).replace(/<[^>]*>/g, '');
  const imageUrl = post.cover || '/og-image.jpg';

  return {
    title: `${post.title} | Ray Armillion Blog`,
    description,
    keywords: [post.category, 'Ray Armillion', 'gospel music', 'blog'],
    authors: [{ name: post.author || 'Ray Armillion' }],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author || 'Ray Armillion'],
      tags: [post.category],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

// Generate static params for popular posts
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true, deletedAt: null },
    select: { slug: true },
    take: 20,
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Fetch related posts
async function getRelatedPosts(currentSlug: string, category: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      deletedAt: null,
      slug: { not: currentSlug },
      category,
    },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    select: {
      slug: true,
      title: true,
      cover: true,
      excerpt: true,
      publishedAt: true,
    },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  const post = await prisma.post.findUnique({
    where: { slug, published: true, deletedAt: null },
  });

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category);
  
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <>
      <ArticleSchema
        headline={post.title}
        description={post.excerpt || post.content.slice(0, 160).replace(/<[^>]*>/g, '')}
        image={post.cover || undefined}
        datePublished={post.publishedAt?.toISOString() || post.createdAt.toISOString()}
        dateModified={post.updatedAt.toISOString()}
        author={post.author || 'Ray Armillion'}
        category={post.category}
        slug={slug}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: post.title, path: `/blog/${slug}` },
        ]}
      />

      <article className="relative min-h-screen bg-slate-950">
        {/* Hero Section */}
        <header className="relative pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors mb-8"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category Badge */}
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
              {post.author && (
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <FaCalendar className="w-4 h-4" />
                  <time dateTime={post.publishedAt?.toISOString()}>
                    {formattedDate}
                  </time>
                </div>
              )}
            </div>

            {/* Cover Image */}
            {post.cover && (
              <div className="relative aspect-video rounded-2xl overflow-hidden glow-mixed">
                <Image
                  src={post.cover}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-amber-400 prose-strong:text-white prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-slate-400 flex items-center gap-2">
                <FaShare className="w-4 h-4" />
                Share this article:
              </span>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://www.staramillion.com/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500/30 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://www.staramillion.com/blog/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-white/10 py-16 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                      <Image
                        src={related.cover || '/og-image.jpg'}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
