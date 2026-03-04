import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/tickets/success',
          '/merchandise/success',
          '/events/*/success',
          '/events/*/cancel',
        ],
      },
    ],
    sitemap: 'https://www.staramillion.com/sitemap.xml',
    host: 'https://www.staramillion.com',
  };
}
