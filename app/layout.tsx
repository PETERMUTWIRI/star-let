import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '@/components/PageTransition';
import BackToTop from '@/components/BackToTop';
import CookieConsent from '@/components/CookieConsent';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { WebSiteSchema } from '@/components/StructuredData';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Ray Armillion | Official Website",
    template: "%s | Ray Armillion",
  },
  description: "Ray Armillion - Kenyan-American Gospel Artist creating soulful music that resonates with hearts worldwide. From refugee to cancer survivor to celebrated performer. Explore albums, singles, videos, tour dates, and more.",
  keywords: ['Ray Armillion', 'gospel music', 'christian artist', 'kenyan music', 'worship', 'live performance', 'cancer survivor', 'refugee story', 'Maasai heritage'],
  authors: [{ name: "Ray Armillion" }],
  creator: "Ray Armillion",
  publisher: "Ray Armillion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.staramillion.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/rahab_kinity_logo.png',
    shortcut: '/rahab_kinity_logo.png',
    apple: '/rahab_kinity_logo.png',
  },
  openGraph: {
    title: "Ray Armillion | Official Website",
    description: "Kenyan-American Gospel Artist creating soulful music that resonates with hearts worldwide.",
    url: 'https://www.staramillion.com',
    siteName: "Ray Armillion",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ray Armillion - Official Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ray Armillion | Official Website",
    description: "Kenyan-American Gospel Artist creating soulful music that resonates with hearts worldwide.",
    images: ['/og-image.jpg'],
    creator: '@rahabkinity',
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'music',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-slate-950 text-white overscroll-none`}>
        <WebSiteSchema />
        <div className="fixed inset-0 bg-gradient-mesh pointer-events-none z-0" />
        <ReadingProgressBar />
        <Navbar />
        <main className="relative z-10 pt-20 !border-none !shadow-none">
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
