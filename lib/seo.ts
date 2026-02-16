import { Metadata } from 'next';

/**
 * SEO Metadata Configuration for Star Amillion - Kenyan-American Gospel/Inspirational Singer
 * Base URL: https://starletmusic.com
 */

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

export const SITE_CONFIG = {
  name: 'Star Amillion',
  title: 'Star Amillion | Official Website',
  description:
    'Official website of Star Amillion - Kenyan-American gospel and inspirational singer. Experience soul-stirring music that blends Kenyan heritage with contemporary sound.',
  url: 'https://starletmusic.com',
  locale: 'en_US',
  author: 'Star Amillion',
  keywords: [
    'Star Amillion',
    'Kenyan gospel singer',
    'African gospel music',
    'inspirational music',
    'gospel artist',
    'Maasai heritage',
    'Kenyan American artist',
    'contemporary gospel',
    'worship music',
    'soul music',
    'Christian music',
    'live performance',
    'refugee story',
    'cancer survivor',
  ],
  ogImage: '/og-image.jpg',
  twitterHandle: '@rahabkinity',
} as const;

// ============================================================================
// BASE METADATA FACTORY
// ============================================================================

interface SEOMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  ogImages?: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
}

/**
 * Creates a complete Metadata object with all SEO properties
 */
function createMetadata(options: SEOMetadataOptions): Metadata {
  const { title, description, keywords = [], path, ogImage, ogType = 'website', ogImages } = options;
  const fullUrl = `${SITE_CONFIG.url}${path}`;
  const defaultOgImage = {
    url: ogImage || SITE_CONFIG.ogImage,
    width: 1200,
    height: 630,
    alt: title,
  };

  return {
    title: `${title} | ${SITE_CONFIG.name}`,
    description,
    keywords: [...SITE_CONFIG.keywords, ...keywords],
    authors: [{ name: SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.author,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: fullUrl,
      siteName: SITE_CONFIG.name,
      locale: SITE_CONFIG.locale,
      type: ogType,
      images: ogImages || [defaultOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: ogImages ? ogImages.map((img) => img.url) : [ogImage || SITE_CONFIG.ogImage],
    },
  };
}

// ============================================================================
// PAGE-SPECIFIC METADATA GENERATORS
// ============================================================================

/**
 * Home Page - Main landing page
 */
export function generateHomeMetadata(): Metadata {
  return createMetadata({
    title: 'Home',
    description:
      'Welcome to the official website of Star Amillion. Discover soulful gospel music, upcoming events, and the inspiring journey of a Kenyan-American artist.',
    path: '/',
    keywords: [
      'official website',
      'home',
      'landing page',
      'new music',
      'latest releases',
    ],
  });
}

/**
 * Music Page - Music catalog and releases
 */
export function generateMusicMetadata(): Metadata {
  return createMetadata({
    title: 'Music',
    description:
      'Stream and download Star Amillion\'s gospel and inspirational music. Explore albums, singles, and collaborations that celebrate faith and Kenyan heritage.',
    path: '/music',
    keywords: [
      'music streaming',
      'gospel albums',
      'singles',
      'discography',
      'Spotify',
      'Apple Music',
      'YouTube Music',
      'audio',
      'songs',
      'worship songs',
    ],
  });
}

/**
 * Videos Page - Video content and performances
 */
export function generateVideosMetadata(): Metadata {
  return createMetadata({
    title: 'Videos',
    description:
      'Watch music videos, live performances, and behind-the-scenes content from Star Amillion. Experience the energy of Kenyan-American gospel performances.',
    path: '/videos',
    keywords: [
      'music videos',
      'live performances',
      'concert footage',
      'YouTube',
      'video content',
      'behind the scenes',
      'performance videos',
      'gospel videos',
    ],
  });
}

/**
 * Events Page - Concerts, tours, and appearances
 */
export function generateEventsMetadata(): Metadata {
  return createMetadata({
    title: 'Events',
    description:
      'Find upcoming concerts, tours, and live performances by Star Amillion. Get tickets and experience the powerful energy of live gospel music.',
    path: '/events',
    keywords: [
      'concerts',
      'tour dates',
      'live shows',
      'events calendar',
      'tickets',
      'performances',
      'gospel concerts',
      'bookings',
    ],
  });
}

/**
 * About Page - Artist biography and story
 */
export function generateAboutMetadata(): Metadata {
  return createMetadata({
    title: 'About',
    description:
      'Learn the inspiring story of Star Amillion - from Kenyan refugee to gospel singer and cancer survivor. Discover her journey of resilience through music.',
    path: '/about',
    keywords: [
      'biography',
      'artist story',
      'about Star Amillion',
      'Kenyan heritage',
      'Maasai culture',
      'refugee journey',
      'cancer survivor',
      'inspiring story',
      'artist bio',
    ],
  });
}

/**
 * Blog Page - News, updates, and articles
 */
export function generateBlogMetadata(): Metadata {
  return createMetadata({
    title: 'Blog',
    description:
      'Read the latest news, stories, and updates from Star Amillion. Insights into music, faith, Kenyan culture, and the journey of an inspirational artist.',
    path: '/blog',
    keywords: [
      'blog',
      'news',
      'updates',
      'articles',
      'stories',
      'faith journey',
      'music insights',
      'Kenyan culture',
      'inspiration',
    ],
  });
}

/**
 * Contact Page - Contact information and booking
 */
export function generateContactMetadata(): Metadata {
  return createMetadata({
    title: 'Contact',
    description:
      'Get in touch with Star Amillion for bookings, press inquiries, collaborations, and fan messages. Connect with this Kenyan-American gospel artist today.',
    path: '/contact',
    keywords: [
      'contact',
      'bookings',
      'inquiries',
      'press',
      'collaboration',
      'management',
      'booking agent',
      'fan mail',
      'connect',
    ],
  });
}

/**
 * Privacy Policy Page
 */
export function generatePrivacyMetadata(): Metadata {
  return createMetadata({
    title: 'Privacy Policy',
    description:
      'Privacy policy for Star Amillion\'s official website. Learn how we collect, use, and protect your personal information and data privacy rights.',
    path: '/privacy',
    keywords: [
      'privacy policy',
      'data protection',
      'GDPR',
      'privacy rights',
      'personal information',
      'cookies policy',
    ],
  });
}

/**
 * Terms of Service Page
 */
export function generateTermsMetadata(): Metadata {
  return createMetadata({
    title: 'Terms of Service',
    description:
      'Terms and conditions for using Star Amillion\'s official website. Read our terms of service, usage policies, and legal agreements.',
    path: '/terms',
    keywords: [
      'terms of service',
      'terms and conditions',
      'legal',
      'usage policy',
      'agreement',
      'disclaimer',
    ],
  });
}

/**
 * Accessibility Statement Page
 */
export function generateAccessibilityMetadata(): Metadata {
  return createMetadata({
    title: 'Accessibility',
    description:
      'Accessibility statement for Star Amillion\'s website. Our commitment to making music and content accessible to all fans, regardless of ability.',
    path: '/accessibility',
    keywords: [
      'accessibility',
      'WCAG',
      'accessible website',
      'disability access',
      'screen reader',
      'inclusive design',
      'web accessibility',
    ],
  });
}

// ============================================================================
// DYNAMIC METADATA GENERATORS
// ============================================================================

interface BlogPostMetadataParams {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  publishedAt?: string;
  tags?: string[];
}

/**
 * Generate metadata for individual blog posts
 */
export function generateBlogPostMetadata(params: BlogPostMetadataParams): Metadata {
  const { title, excerpt, slug, coverImage, tags = [] } = params;

  return createMetadata({
    title,
    description: excerpt.slice(0, 160),
    path: `/blog/${slug}`,
    ogType: 'article',
    ogImage: coverImage,
    keywords: tags,
  });
}

interface EventMetadataParams {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  location?: string;
  startDate?: string;
}

/**
 * Generate metadata for individual event pages
 */
export function generateEventMetadata(params: EventMetadataParams): Metadata {
  const { title, description, slug, coverImage, location } = params;
  const locationText = location ? ` in ${location}` : '';

  return createMetadata({
    title: `${title}${locationText}`,
    description: description.slice(0, 160),
    path: `/events/${slug}`,
    ogType: 'article',
    ogImage: coverImage,
    keywords: ['concert', 'live event', 'tickets', location || ''].filter(Boolean),
  });
}

interface MusicTrackMetadataParams {
  title: string;
  description?: string;
  slug: string;
  coverImage?: string;
  type: 'single' | 'album' | 'ep';
}

/**
 * Generate metadata for individual music tracks/albums
 */
export function generateMusicTrackMetadata(params: MusicTrackMetadataParams): Metadata {
  const { title, description, slug, coverImage, type } = params;

  return createMetadata({
    title: `${title} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
    description: description || `Listen to ${title} by Star Amillion. Available on all streaming platforms.`,
    path: `/music/${slug}`,
    ogImage: coverImage,
    keywords: [type, 'new release', 'streaming', 'download'],
  });
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Default export for easy importing of all generators
 */
export const SEO = {
  config: SITE_CONFIG,
  home: generateHomeMetadata,
  music: generateMusicMetadata,
  videos: generateVideosMetadata,
  events: generateEventsMetadata,
  about: generateAboutMetadata,
  blog: generateBlogMetadata,
  contact: generateContactMetadata,
  privacy: generatePrivacyMetadata,
  terms: generateTermsMetadata,
  accessibility: generateAccessibilityMetadata,
  blogPost: generateBlogPostMetadata,
  event: generateEventMetadata,
  musicTrack: generateMusicTrackMetadata,
} as const;

export default SEO;
