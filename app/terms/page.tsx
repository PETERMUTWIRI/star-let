'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-brand-background">
      {/* HERO */}
      <section className="bg-brand-background pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-brand-text mb-4">
            Terms of Service
          </h1>
          <p className="text-brand-text/70">
            Last updated: January 2025
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 bg-brand-background">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="prose prose-lg max-w-none text-brand-text/80">
            
            <p className="text-xl text-brand-text/70 mb-8">
              Welcome to Starlet Music (starletmusic.com). By accessing or using our website, 
              you agree to be bound by these Terms of Service. Please read them carefully 
              before using our services.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">1. Introduction</h2>
            <p className="mb-4">
              These Terms of Service govern your use of the Starlet Music website and all 
              related services, including music streaming, ticket purchases for live events, 
              merchandise sales, and fan community features. By accessing or using our website, 
              you agree to comply with these terms.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">2. Use of Website</h2>
            <p className="mb-4">
              Starlet Music provides a platform for fans to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Stream and preview music tracks and albums</li>
              <li>Watch music videos and behind-the-scenes content</li>
              <li>Purchase tickets for concerts, tours, and special events</li>
              <li>Buy official merchandise including apparel and accessories</li>
              <li>Subscribe to newsletters for updates on new releases and tour dates</li>
              <li>Engage with community features including comments and fan submissions</li>
            </ul>
            <p className="mb-4">
              You agree to use our website only for lawful purposes and in a way that does not 
              infringe the rights of others or restrict their use and enjoyment of the site.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">3. Ticket Purchases</h2>
            <p className="mb-4">
              When purchasing tickets through Starlet Music:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>All ticket sales are processed securely through our payment provider Stripe</li>
              <li>Tickets are typically non-refundable unless an event is cancelled</li>
              <li>In the event of a cancellation, refunds will be issued to the original payment method</li>
              <li>Rescheduled events will honor original tickets for the new date</li>
              <li>Ticket transfers must comply with the venue&apos;s policies</li>
              <li>We reserve the right to cancel orders suspected of scalping or fraudulent activity</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">4. Intellectual Property</h2>
            <p className="mb-4">
              All content on this website, including but not limited to music, videos, images, 
              logos, lyrics, and artwork, is the exclusive property of Starlet Music or its 
              licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mb-4">
              You may:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Stream music and videos for personal, non-commercial use</li>
              <li>Share links to our content on social media</li>
              <li>Download purchased music files for personal listening</li>
            </ul>
            <p className="mb-4">
              You may not:
            </p>
            <ul class="list-disc pl-6 mb-6 space-y-2">
              <li>Reproduce, distribute, or publicly perform any music without authorization</li>
              <li>Use our content for commercial purposes without written permission</li>
              <li>Remove or alter any copyright notices or watermarks</li>
              <li>Create derivative works from our music, videos, or artwork without permission</li>
              <li>Upload our content to unauthorized streaming or file-sharing platforms</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">5. User Content</h2>
            <p className="mb-4">
              By submitting content to our website (including comments, fan art, and messages):
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>You grant Starlet Music a non-exclusive, royalty-free license to use, display, 
                  and share your content</li>
              <li>You confirm that your content does not infringe on any third-party rights</li>
              <li>We reserve the right to remove any content that violates these terms or is 
                  deemed inappropriate</li>
              <li>Harassment, hate speech, and spam will not be tolerated</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">6. Merchandise</h2>
            <p className="mb-4">
              All merchandise sales are subject to availability. We reserve the right to limit 
              quantities and discontinue products at any time. Shipping times are estimates and 
              may vary based on location. Defective or damaged items may be returned within 30 
              days for a replacement or refund.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">7. Disclaimer of Warranties</h2>
            <p className="mb-4">
              This website and its content are provided &quot;as is&quot; without any warranties, 
              express or implied. While we strive for uninterrupted service, we do not guarantee 
              that the website will always be available, secure, or error-free.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, Starlet Music shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising out of 
              or relating to your use of the website, even if we have been advised of the 
              possibility of such damages.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">9. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms of Service at any time. Changes will 
              be effective immediately upon posting to the website. Your continued use of the 
              website after any changes indicates your acceptance of the updated terms.
            </p>

            <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">10. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-white rounded-xl p-6 mt-4 shadow-sm">
              <p className="mb-1"><strong>Starlet Music</strong></p>
              <p className="mb-1">Email: <a href="mailto:legal@starletmusic.com" className="text-brand-dark hover:underline">legal@starletmusic.com</a></p>
              <p className="mb-1">Management: <a href="mailto:booking@starletmusic.com" className="text-brand-dark hover:underline">booking@starletmusic.com</a></p>
            </div>

            <p className="mt-8 text-sm text-brand-text/50">
              By using this website, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service.
            </p>

          </div>

          <div className="mt-16 pt-8 border-t border-brand-text/10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-brand-dark font-semibold hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
