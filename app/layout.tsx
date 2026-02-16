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
    default: "Star Amillion | Official Website",
    template: "%s | Star Amillion",
  },
  description: "Star Amillion - Kenyan-American Gospel Artist creating soulful music that resonates with hearts worldwide. From refugee to cancer survivor to celebrated performer. Explore albums, singles, videos, tour dates, and more.",
  keywords: ['Star Amillion', 'gospel music', 'christian artist', 'kenyan music', 'worship', 'live performance', 'cancer survivor', 'refugee story', 'Maasai heritage'],
  authors: [{ name: "Star Amillion" }],
  creator: "Star Amillion",
  publisher: "Star Amillion",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://starletmusic.com'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/rahab_kinity_logo.png',
    shortcut: '/rahab_kinity_logo.png',
    apple: '/rahab_kinity_logo.png',
  },
  openGraph: {
    title: "Star Amillion | Official Website",
    description: "Kenyan-American Gospel Artist creating soulful music that resonates with hearts worldwide.",
    url: 'https://starletmusic.com',
    siteName: "Star Amillion",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Star Amillion - Official Website',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Star Amillion | Official Website",
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
        <main className="relative z-10 pt-20">
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
