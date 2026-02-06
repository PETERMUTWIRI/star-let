import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '@/components/PageTransition';
import BackToTop from '@/components/BackToTop';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Starlet | Official Website",
    template: "%s | Starlet",
  },
  description: "Starlet - Independent artist creating soulful music that resonates with hearts worldwide. Explore albums, singles, videos, tour dates, and more.",
  keywords: ['music', 'artist', 'pop', 'indie', 'albums', 'singles', 'concerts', 'tour', 'starlet', 'musician', 'singer', 'songwriter'],
  authors: [{ name: "Starlet" }],
  creator: "Starlet",
  publisher: "Starlet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://starletmusic.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Starlet | Official Website",
    description: "Independent artist creating soulful music that resonates with hearts worldwide.",
    url: 'https://starletmusic.com',
    siteName: "Starlet",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Starlet - Official Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Starlet | Official Website",
    description: "Independent artist creating soulful music that resonates with hearts worldwide.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-slate-950 text-white`}>
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none z-0" />
        <Navbar />
        <main className="relative z-10">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
        <Footer />
        <BackToTop />
        <CookieConsent />
      </body>
    </html>
  );
}
