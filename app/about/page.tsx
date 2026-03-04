import { Metadata } from 'next';
import { MusicGroupSchema, BreadcrumbSchema } from '@/components/StructuredData';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About | Ray Armillion',
  description: 'Discover the inspiring journey of Ray Armillion - from Kenyan refugee to cancer survivor to celebrated gospel artist. Learn about her Maasai heritage, her music, and her mission to inspire through performance.',
  keywords: ['Ray Armillion', 'about', 'biography', 'Kenyan artist', 'gospel singer', 'cancer survivor', 'refugee story', 'Maasai heritage'],
  openGraph: {
    title: 'About Ray Armillion | Official Biography',
    description: 'From refugee to cancer survivor to celebrated performer. Discover the inspiring journey of Kenyan-American gospel artist Ray Armillion.',
    images: [
      {
        url: '/images/about/Rahab.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ray Armillion - Kenyan Gospel Artist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Ray Armillion | Official Biography',
    description: 'From refugee to cancer survivor to celebrated performer.',
    images: ['/images/about/Rahab.jpeg'],
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <MusicGroupSchema />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]}
      />
      <AboutContent />
    </>
  );
}
