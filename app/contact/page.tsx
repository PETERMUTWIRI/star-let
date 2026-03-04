import { Metadata } from 'next';
import { MusicGroupSchema, BreadcrumbSchema } from '@/components/StructuredData';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
  title: 'Contact | Ray Armillion',
  description: 'Get in touch with Ray Armillion for booking inquiries, event collaborations, media requests, or general questions. Connect via WhatsApp, email, or phone.',
  keywords: ['Ray Armillion', 'contact', 'booking', 'inquiry', 'gospel artist booking', 'event collaboration', 'media contact'],
  openGraph: {
    title: 'Contact Ray Armillion | Booking & Inquiries',
    description: 'Book Ray Armillion for your event, collaboration, or media appearance. Quick response via WhatsApp.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact Ray Armillion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Ray Armillion | Booking & Inquiries',
    description: 'Book Ray Armillion for your event. Quick response via WhatsApp.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <MusicGroupSchema />
      <BreadcrumbSchema
        items={[
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]}
      />
      <ContactContent />
    </>
  );
}
