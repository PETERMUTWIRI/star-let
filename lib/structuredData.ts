/**
 * Structured Data (JSON-LD) Utility for Rahab Kinity Music Website
 * 
 * This module provides functions to generate schema.org JSON-LD structured data
 * for various content types on the starletmusic.com website.
 * 
 * @see https://schema.org/docs/schemas.html
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/** Base URL for the website */
export const SITE_URL = 'https://starletmusic.com';

/** Default locale for the website */
export const DEFAULT_LOCALE = 'en-US';

/** Artist/Organization Information */
export const ARTIST_INFO = {
  name: 'Rahab Kinity',
  alternateName: 'Starlet Music',
  description: 'Kenyan-American gospel and inspirational singer spreading hope through powerful vocals and uplifting music.',
  tagline: 'Inspiring Hearts Through Music',
  email: 'contact@starletmusic.com',
  phone: '+1-XXX-XXX-XXXX', // Placeholder - update with actual number
  foundingDate: '2020-01-01', // Placeholder - update with actual date
  nationality: 'Kenyan-American',
  genre: ['Gospel', 'Inspirational', 'Christian', 'Worship'],
  location: {
    '@type': 'Place' as const,
    name: 'United States',
    address: {
      '@type': 'PostalAddress' as const,
      addressCountry: 'US',
    },
  },
} as const;

/** Social Media Profiles */
export const SOCIAL_PROFILES = {
  facebook: 'https://facebook.com/rahabkinity',      // Placeholder
  instagram: 'https://instagram.com/rahabkinity',    // Placeholder
  twitter: 'https://twitter.com/rahabkinity',        // Placeholder
  youtube: 'https://youtube.com/@rahabkinity',       // Placeholder
  spotify: 'https://open.spotify.com/artist/rahabkinity', // Placeholder
  appleMusic: 'https://music.apple.com/artist/rahabkinity', // Placeholder
  soundcloud: 'https://soundcloud.com/rahabkinity',  // Placeholder
  tiktok: 'https://tiktok.com/@rahabkinity',         // Placeholder
} as const;

/** Default Images */
export const DEFAULT_IMAGES = {
  logo: `${SITE_URL}/images/logo.png`,
  artist: `${SITE_URL}/images/rahab-kinity.jpg`,
  placeholderAlbum: `${SITE_URL}/images/album-placeholder.jpg`,
  placeholderTrack: `${SITE_URL}/images/track-placeholder.jpg`,
} as const;

/** Music Platform URLs */
export const MUSIC_PLATFORMS = {
  spotify: 'https://open.spotify.com',
  appleMusic: 'https://music.apple.com',
  youtubeMusic: 'https://music.youtube.com',
  amazonMusic: 'https://music.amazon.com',
  tidal: 'https://tidal.com',
  deezer: 'https://deezer.com',
} as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format a date to ISO 8601 format for schema.org
 * @param date - Date string or Date object
 * @returns ISO 8601 formatted date string
 */
export function toISODate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Format duration in seconds to ISO 8601 duration format (PT#M#S)
 * @param seconds - Duration in seconds
 * @returns ISO 8601 duration string (e.g., "PT3M45S")
 */
export function toISODuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  let duration = 'PT';
  if (hours > 0) duration += `${hours}H`;
  if (minutes > 0) duration += `${minutes}M`;
  if (secs > 0 || (hours === 0 && minutes === 0)) duration += `${secs}S`;

  return duration;
}

/**
 * Generate a URL from a path
 * @param path - URL path (with or without leading slash)
 * @returns Full URL
 */
export function generateUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Safely stringify JSON-LD data
 * @param data - JSON-LD data object
 * @returns JSON string safe for embedding in HTML
 */
export function stringifyJsonLd(data: unknown): string {
  return JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Image object with required properties */
export interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

/** Person reference (for byArtist, etc.) */
export interface PersonReference {
  '@type': 'Person' | 'MusicGroup';
  '@id'?: string;
  name: string;
  url?: string;
}

/** Offer for events or products */
export interface Offer {
  '@type': 'Offer';
  url?: string;
  price?: string | number;
  priceCurrency?: string;
  availability?: string;
  validFrom?: string;
  category?: string;
}

/** Aggregate rating */
export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number | string;
  reviewCount: number;
  bestRating?: number;
}

/** Place/venue for events */
export interface Place {
  '@type': 'Place';
  name: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  url?: string;
}

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================

/**
 * Generate MusicGroup schema for the artist/band
 * @see https://schema.org/MusicGroup
 */
export interface MusicGroupInput {
  name?: string;
  description?: string;
  image?: string;
  url?: string;
  genre?: string[];
  sameAs?: string[];
  foundingDate?: string;
  member?: PersonReference[];
}

export function generateMusicGroupSchema(input: MusicGroupInput = {}): object {
  const {
    name = ARTIST_INFO.name,
    description = ARTIST_INFO.description,
    image = DEFAULT_IMAGES.artist,
    url = SITE_URL,
    genre = [...ARTIST_INFO.genre],
    sameAs = Object.values(SOCIAL_PROFILES),
    foundingDate = ARTIST_INFO.foundingDate,
    member,
  } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${SITE_URL}/#musicgroup`,
    name,
    alternateName: ARTIST_INFO.alternateName,
    description,
    image,
    url,
    genre,
    sameAs,
    foundingDate,
    nationality: {
      '@type': 'Country',
      name: ARTIST_INFO.nationality,
    },
    ...(member && { member }),
  };
}

/**
 * Generate MusicAlbum schema
 * @see https://schema.org/MusicAlbum
 */
export interface MusicAlbumInput {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  byArtist?: PersonReference | string;
  datePublished?: string;
  genre?: string[];
  numTracks?: number;
  track?: Array<{
    '@type': 'MusicRecording';
    name: string;
    url?: string;
    duration?: string;
  }>;
  albumProductionType?: string;
  albumReleaseType?: string;
  aggregateRating?: AggregateRating;
}

export function generateMusicAlbumSchema(input: MusicAlbumInput): object {
  const {
    name,
    description,
    image = DEFAULT_IMAGES.placeholderAlbum,
    url,
    byArtist = { '@type': 'MusicGroup', name: ARTIST_INFO.name, url: SITE_URL },
    datePublished,
    genre = [...ARTIST_INFO.genre],
    numTracks,
    track,
    albumProductionType = 'StudioAlbum',
    albumReleaseType = 'Album',
    aggregateRating,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name,
    description,
    image,
    byArtist: typeof byArtist === 'string' 
      ? { '@type': 'MusicGroup', name: byArtist }
      : byArtist,
    genre,
    albumProductionType,
    albumReleaseType,
  };

  if (url) schema.url = url;
  if (datePublished) schema.datePublished = toISODate(datePublished);
  if (numTracks) schema.numTracks = numTracks;
  if (track) schema.track = track;
  if (aggregateRating) schema.aggregateRating = aggregateRating;

  return schema;
}

/**
 * Generate MusicRecording schema for individual songs/singles
 * @see https://schema.org/MusicRecording
 */
export interface MusicRecordingInput {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  byArtist?: PersonReference | string;
  duration?: number | string; // seconds or ISO 8601 duration
  inAlbum?: string | { '@type': 'MusicAlbum'; name: string; url?: string };
  datePublished?: string;
  genre?: string[];
  isrcCode?: string; // International Standard Recording Code
  audio?: {
    '@type': 'AudioObject';
    contentUrl: string;
    duration?: string;
    encodingFormat?: string;
  };
}

export function generateMusicRecordingSchema(input: MusicRecordingInput): object {
  const {
    name,
    description,
    image = DEFAULT_IMAGES.placeholderTrack,
    url,
    byArtist = { '@type': 'MusicGroup', name: ARTIST_INFO.name, url: SITE_URL },
    duration,
    inAlbum,
    datePublished,
    genre = [...ARTIST_INFO.genre],
    isrcCode,
    audio,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicRecording',
    name,
    description,
    image,
    byArtist: typeof byArtist === 'string'
      ? { '@type': 'MusicGroup', name: byArtist }
      : byArtist,
    genre,
  };

  if (url) schema.url = url;
  if (duration) {
    schema.duration = typeof duration === 'number' ? toISODuration(duration) : duration;
  }
  if (inAlbum) {
    schema.inAlbum = typeof inAlbum === 'string' 
      ? { '@type': 'MusicAlbum', name: inAlbum }
      : inAlbum;
  }
  if (datePublished) schema.datePublished = toISODate(datePublished);
  if (isrcCode) schema.isrcCode = isrcCode;
  if (audio) schema.audio = audio;

  return schema;
}

/**
 * Generate Event schema for concerts/performances
 * @see https://schema.org/Event
 * @see https://schema.org/MusicEvent
 */
export interface EventInput {
  name: string;
  description?: string;
  image?: string;
  url?: string;
  startDate: string | Date;
  endDate?: string | Date;
  eventStatus?: 'EventScheduled' | 'EventPostponed' | 'EventCancelled' | 'EventRescheduled';
  eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode';
  location: Place | { '@type': 'VirtualLocation'; url: string };
  performer?: PersonReference | PersonReference[];
  offers?: Offer | Offer[];
  organizer?: {
    '@type': 'Organization' | 'Person';
    name: string;
    url?: string;
  };
}

export function generateEventSchema(input: EventInput): object {
  const {
    name,
    description,
    image = DEFAULT_IMAGES.artist,
    url,
    startDate,
    endDate,
    eventStatus = 'EventScheduled',
    eventAttendanceMode = 'OfflineEventAttendanceMode',
    location,
    performer = { '@type': 'MusicGroup', name: ARTIST_INFO.name, url: SITE_URL },
    offers,
    organizer,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MusicEvent',
    name,
    description,
    image,
    startDate: toISODate(startDate),
    eventStatus: `https://schema.org/${eventStatus}`,
    eventAttendanceMode: `https://schema.org/${eventAttendanceMode}`,
    location,
    performer: Array.isArray(performer) ? performer : [performer],
  };

  if (url) schema.url = url;
  if (endDate) schema.endDate = toISODate(endDate);
  if (offers) schema.offers = Array.isArray(offers) ? offers : [offers];
  if (organizer) schema.organizer = organizer;

  return schema;
}

/**
 * Generate VideoObject schema for music videos
 * @see https://schema.org/VideoObject
 */
export interface VideoObjectInput {
  name: string;
  description?: string;
  thumbnailUrl: string | string[];
  contentUrl?: string;
  embedUrl?: string;
  uploadDate: string | Date;
  duration?: number | string; // seconds or ISO 8601 duration
  width?: number;
  height?: number;
  url?: string;
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo?: ImageObject | string;
  };
  interactionStatistic?: {
    '@type': 'InteractionCounter';
    interactionType: { '@type': 'WatchAction' };
    userInteractionCount: number;
  };
}

export function generateVideoObjectSchema(input: VideoObjectInput): object {
  const {
    name,
    description,
    thumbnailUrl,
    contentUrl,
    embedUrl,
    uploadDate,
    duration,
    width,
    height,
    url,
    publisher = {
      '@type': 'Organization',
      name: ARTIST_INFO.name,
      logo: DEFAULT_IMAGES.logo,
    },
    interactionStatistic,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate: toISODate(uploadDate),
    publisher,
  };

  if (url) schema.url = url;
  if (contentUrl) schema.contentUrl = contentUrl;
  if (embedUrl) schema.embedUrl = embedUrl;
  if (duration) {
    schema.duration = typeof duration === 'number' ? toISODuration(duration) : duration;
  }
  if (width) schema.width = width;
  if (height) schema.height = height;
  if (interactionStatistic) schema.interactionStatistic = interactionStatistic;

  return schema;
}

/**
 * Generate WebSite schema for the main site
 * @see https://schema.org/WebSite
 */
export interface WebSiteInput {
  name?: string;
  description?: string;
  url?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
  inLanguage?: string;
}

export function generateWebSiteSchema(input: WebSiteInput = {}): object {
  const {
    name = ARTIST_INFO.alternateName,
    description = ARTIST_INFO.description,
    url = SITE_URL,
    potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage = DEFAULT_LOCALE,
  } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name,
    description,
    url,
    potentialAction,
    inLanguage,
  };
}

/**
 * Generate WebPage schema for individual pages
 * @see https://schema.org/WebPage
 */
export interface WebPageInput {
  name: string;
  description?: string;
  url: string;
  isPartOf?: string;
  primaryImageOfPage?: ImageObject | string;
  breadcrumb?: object;
  datePublished?: string | Date;
  dateModified?: string | Date;
  author?: PersonReference;
  inLanguage?: string;
}

export function generateWebPageSchema(input: WebPageInput): object {
  const {
    name,
    description,
    url,
    isPartOf = `${SITE_URL}/#website`,
    primaryImageOfPage,
    breadcrumb,
    datePublished,
    dateModified,
    author = { '@type': 'MusicGroup', name: ARTIST_INFO.name, url: SITE_URL },
    inLanguage = DEFAULT_LOCALE,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name,
    url,
    isPartOf: { '@id': isPartOf },
    inLanguage,
    author,
  };

  if (description) schema.description = description;
  if (primaryImageOfPage) {
    schema.primaryImageOfPage = typeof primaryImageOfPage === 'string'
      ? { '@type': 'ImageObject', url: primaryImageOfPage }
      : primaryImageOfPage;
  }
  if (breadcrumb) schema.breadcrumb = breadcrumb;
  if (datePublished) schema.datePublished = toISODate(datePublished);
  if (dateModified) schema.dateModified = toISODate(dateModified);

  return schema;
}

/**
 * Generate BreadcrumbList schema for navigation
 * @see https://schema.org/BreadcrumbList
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
  position?: number;
}

export interface BreadcrumbListInput {
  items: BreadcrumbItem[];
}

export function generateBreadcrumbListSchema(input: BreadcrumbListInput): object {
  const { items } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Organization schema for the business entity
 * @see https://schema.org/Organization
 * @see https://schema.org/MusicGroup (for more specific music organization)
 */
export interface OrganizationInput {
  name?: string;
  alternateName?: string;
  description?: string;
  url?: string;
  logo?: string | ImageObject;
  image?: string;
  email?: string;
  telephone?: string;
  sameAs?: string[];
  foundingDate?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
    email?: string;
    availableLanguage?: string | string[];
  } | Array<{
    '@type': 'ContactPoint';
    telephone?: string;
    contactType: string;
    email?: string;
    availableLanguage?: string | string[];
  }>;
}

export function generateOrganizationSchema(input: OrganizationInput = {}): object {
  const {
    name = ARTIST_INFO.alternateName,
    alternateName = ARTIST_INFO.name,
    description = ARTIST_INFO.description,
    url = SITE_URL,
    logo = DEFAULT_IMAGES.logo,
    image = DEFAULT_IMAGES.artist,
    email = ARTIST_INFO.email,
    telephone = ARTIST_INFO.phone,
    sameAs = Object.values(SOCIAL_PROFILES),
    foundingDate = ARTIST_INFO.foundingDate,
    address,
    contactPoint,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name,
    alternateName,
    description,
    url,
    logo: typeof logo === 'string' ? { '@type': 'ImageObject', url: logo } : logo,
    image,
    sameAs,
    foundingDate,
  };

  if (email) schema.email = email;
  if (telephone) schema.telephone = telephone;
  if (address) schema.address = address;
  if (contactPoint) schema.contactPoint = contactPoint;

  return schema;
}

/**
 * Generate Person schema for the artist as an individual
 * @see https://schema.org/Person
 */
export interface PersonInput {
  name?: string;
  alternateName?: string;
  description?: string;
  image?: string;
  url?: string;
  jobTitle?: string;
  knowsAbout?: string | string[];
  nationality?: string;
  birthDate?: string | Date;
  birthPlace?: {
    '@type': 'Place';
    name: string;
    address?: {
      '@type': 'PostalAddress';
      addressCountry: string;
    };
  };
  sameAs?: string[];
  affiliation?: {
    '@type': 'Organization' | 'MusicGroup';
    name: string;
    url?: string;
  };
  alumniOf?: {
    '@type': 'Organization' | 'EducationalOrganization';
    name: string;
  };
}

export function generatePersonSchema(input: PersonInput = {}): object {
  const {
    name = ARTIST_INFO.name,
    alternateName,
    description = ARTIST_INFO.description,
    image = DEFAULT_IMAGES.artist,
    url = SITE_URL,
    jobTitle = 'Gospel Singer',
    knowsAbout = ['Gospel Music', 'Inspirational Music', 'Worship', 'Vocals'],
    nationality = ARTIST_INFO.nationality,
    birthDate,
    birthPlace,
    sameAs = Object.values(SOCIAL_PROFILES),
    affiliation = {
      '@type': 'MusicGroup',
      name: ARTIST_INFO.name,
      url: SITE_URL,
    },
    alumniOf,
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name,
    description,
    image,
    url,
    jobTitle,
    knowsAbout,
    nationality: { '@type': 'Country', name: nationality },
    sameAs,
    affiliation,
  };

  if (alternateName) schema.alternateName = alternateName;
  if (birthDate) schema.birthDate = toISODate(birthDate).split('T')[0];
  if (birthPlace) schema.birthPlace = birthPlace;
  if (alumniOf) schema.alumniOf = alumniOf;

  return schema;
}

// ============================================================================
// COMBINED SCHEMA GENERATORS
// ============================================================================

/**
 * Generate complete artist page schema combining Person, MusicGroup, and Organization
 * This is useful for the main artist/about page
 */
export function generateArtistPageSchema(): object[] {
  return [
    generatePersonSchema(),
    generateMusicGroupSchema(),
    generateOrganizationSchema(),
  ];
}

/**
 * Generate complete homepage schema with WebSite, Organization, and MusicGroup
 */
export function generateHomePageSchema(): object[] {
  return [
    generateWebSiteSchema(),
    generateOrganizationSchema(),
    generateMusicGroupSchema(),
  ];
}

/**
 * Generate schema for a music release page (album or single)
 */
export function generateMusicReleasePageSchema(
  albumOrTrack: MusicAlbumInput | MusicRecordingInput,
  isAlbum: boolean = true
): object[] {
  const musicSchema = isAlbum 
    ? generateMusicAlbumSchema(albumOrTrack as MusicAlbumInput)
    : generateMusicRecordingSchema(albumOrTrack as MusicRecordingInput);

  return [
    musicSchema,
    generateMusicGroupSchema(),
  ];
}

// ============================================================================
// REACT/Next.js HELPER COMPONENTS
// ============================================================================

/**
 * Generate the complete <script> tag string for JSON-LD
 * Use this in your Next.js pages or components
 * 
 * Example usage in Next.js:
 * ```tsx
 * import { generateJsonLdScript, generateMusicAlbumSchema } from '@/lib/structuredData';
 * 
 * export default function AlbumPage({ album }) {
 *   const jsonLd = generateMusicAlbumSchema({
 *     name: album.title,
 *     description: album.description,
 *     url: album.url,
 *     datePublished: album.releaseDate,
 *   });
 * 
 *   return (
 *     <>
 *       <script
 *         type="application/ld+json"
 *         dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
 *       />
 *       <AlbumContent album={album} />
 *     </>
 *   );
 * }
 * ```
 */
export { stringifyJsonLd as generateJsonLdScript };

/**
 * Type guard to check if a schema is valid
 */
export function isValidSchema(schema: unknown): schema is { '@context': string; '@type': string } {
  return (
    typeof schema === 'object' &&
    schema !== null &&
    '@context' in schema &&
    '@type' in schema
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Constants
  SITE_URL,
  DEFAULT_LOCALE,
  ARTIST_INFO,
  SOCIAL_PROFILES,
  DEFAULT_IMAGES,
  MUSIC_PLATFORMS,
  
  // Utilities
  toISODate,
  toISODuration,
  generateUrl,
  stringifyJsonLd,
  isValidSchema,
  
  // Schema generators
  generateMusicGroupSchema,
  generateMusicAlbumSchema,
  generateMusicRecordingSchema,
  generateEventSchema,
  generateVideoObjectSchema,
  generateWebSiteSchema,
  generateWebPageSchema,
  generateBreadcrumbListSchema,
  generateOrganizationSchema,
  generatePersonSchema,
  
  // Combined schemas
  generateArtistPageSchema,
  generateHomePageSchema,
  generateMusicReleasePageSchema,
};
