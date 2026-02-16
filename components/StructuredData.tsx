'use client';

import Script from 'next/script';

// Base MusicGroup schema for the artist
export function MusicGroupSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: 'Star Amillion',
    url: 'https://starletmusic.com',
    logo: 'https://starletmusic.com/rahab_kinity_logo.png',
    image: 'https://starletmusic.com/images/about/Rahab.jpeg',
    description: 'Star Amillion - Kenyan-American Gospel Artist creating soulful music that resonates with hearts worldwide. From refugee to cancer survivor to celebrated performer.',
    genre: ['Gospel', 'Christian', 'World Music', 'Contemporary Worship'],
    origin: {
      '@type': 'Country',
      name: 'Kenya',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    sameAs: [
      'https://www.youtube.com/@RahabKinity',
      'https://www.instagram.com/rahabkinity',
      'https://www.tiktok.com/@rahabkinity',
      'https://twitter.com/rahabkinity',
    ],
    member: {
      '@type': 'Person',
      name: 'Star Amillion',
      jobTitle: 'Singer-Songwriter',
      nationality: {
        '@type': 'Country',
        name: 'Kenya',
      },
    },
  };

  return (
    <Script
      id="music-group-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// MusicAlbum schema for releases
interface MusicAlbumSchemaProps {
  name: string;
  description?: string;
  image?: string;
  datePublished?: string;
  numTracks?: number;
  genre?: string[];
  byArtist?: string;
}

export function MusicAlbumSchema({
  name,
  description,
  image,
  datePublished,
  numTracks = 1,
  genre = ['Gospel', 'Christian'],
  byArtist = 'Star Amillion',
}: MusicAlbumSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name,
    description,
    image: image ? `https://starletmusic.com${image}` : undefined,
    datePublished,
    numTracks,
    genre,
    byArtist: {
      '@type': 'MusicGroup',
      name: byArtist,
    },
    url: `https://starletmusic.com/music`,
  };

  return (
    <Script
      id={`album-schema-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Event schema for concerts/performances
interface EventSchemaProps {
  name: string;
  description?: string;
  image?: string;
  startDate: string;
  endDate?: string;
  location: {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
  };
  performer?: string;
  eventStatus?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled' | 'EventMovedOnline';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
}

export function EventSchema({
  name,
  description,
  image,
  startDate,
  endDate,
  location,
  offers,
  performer = 'Star Amillion',
  eventStatus = 'EventScheduled',
  eventAttendanceMode = 'OfflineEventAttendanceMode',
}: EventSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name,
    description,
    image: image ? `https://starletmusic.com${image}` : undefined,
    startDate,
    endDate,
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    performer: {
      '@type': 'MusicGroup',
      name: performer,
    },
    location: {
      '@type': 'Place',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: location.address,
        addressLocality: location.city,
        addressRegion: location.state,
        addressCountry: location.country || 'US',
      },
    },
  };

  if (offers) {
    schema.offers = {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency || 'USD',
      availability: offers.availability
        ? `https://schema.org/${offers.availability}`
        : 'https://schema.org/InStock',
      url: offers.url || 'https://starletmusic.com/events',
      validFrom: new Date().toISOString(),
    };
  }

  return (
    <Script
      id={`event-schema-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// WebSite schema for search box
export function WebSiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Star Amillion Official Website',
    url: 'https://starletmusic.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://starletmusic.com/blog?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// BreadcrumbList schema for navigation
interface BreadcrumbItem {
  name: string;
  path: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://starletmusic.com${item.path}`,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Article schema for blog posts
interface ArticleSchemaProps {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  category?: string;
  slug: string;
}

export function ArticleSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = 'Star Amillion',
  category = 'Music',
  slug,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image: image ? `https://starletmusic.com${image}` : 'https://starletmusic.com/og-image.jpg',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'MusicGroup',
      name: 'Star Amillion',
      logo: {
        '@type': 'ImageObject',
        url: 'https://starletmusic.com/rahab_kinity_logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://starletmusic.com/blog/${slug}`,
    },
    articleSection: category,
  };

  return (
    <Script
      id="article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
