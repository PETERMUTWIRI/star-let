import Link from 'next/link';
import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Accessibility Statement | Ray Armillion',
  description: 'Our commitment to making music and digital content accessible to everyone. Learn about our WCAG 2.1 Level AA compliance and accessibility features.',
  keywords: ['accessibility', 'WCAG', 'screen reader', 'keyboard navigation', 'inclusive design', 'disability access'],
  alternates: {
    canonical: 'https://staramillion.com/accessibility',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AccessibilityPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'Accessibility Statement', path: '/accessibility' },
      ]} />

      <div className="min-h-screen bg-brand-background">
        {/* HERO */}
        <section className="bg-brand-background pt-32 pb-16">
          <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
            <h1 className="text-4xl md:text-5xl font-black text-brand-text mb-4">
              Accessibility Statement
            </h1>
            <p className="text-brand-text/70">
              Our commitment to making music accessible to everyone
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 bg-brand-background">
          <div className="max-w-4xl mx-auto px-6 md:px-12">
            <div className="prose prose-lg max-w-none text-brand-text/80">
              
              <p className="text-xl text-brand-text/70 mb-8">
                Ray Armillion Music is committed to ensuring digital accessibility for people with 
                disabilities. We believe that music should be accessible to everyone, and we 
                continually work to improve the user experience for all visitors to our website.
              </p>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Our Commitment</h2>
              <p className="mb-4">
                We are dedicated to creating an inclusive digital experience that allows all fans 
                to engage with our music, videos, events, and merchandise. Whether you are using 
                assistive technologies or have specific accessibility needs, we want you to be able 
                to enjoy everything Ray Armillion Music has to offer.
              </p>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Conformance Status</h2>
              <p className="mb-4">
                The Web Content Accessibility Guidelines (WCAG) define requirements for designers 
                and developers to improve accessibility for people with disabilities. It defines 
                three levels of conformance:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Level A (minimum)</li>
                <li>Level AA (mid-range)</li>
                <li>Level AAA (highest)</li>
              </ul>
              <p className="mb-4">
                Ray Armillion Music strives to conform to <strong>WCAG 2.1 Level AA</strong> standards. 
                We are continuously working to improve the accessibility of our website to ensure 
                all fans can access our content.
              </p>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Accessibility Features</h2>
              
              <h3 className="text-xl font-semibold text-brand-text mt-8 mb-3">Keyboard Navigation</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>All interactive elements are accessible via keyboard</li>
                <li>Visible focus indicators to show your current position</li>
                <li>Logical tab order for intuitive navigation</li>
                <li>Skip links to bypass repetitive content</li>
                <li>Keyboard-accessible music and video players</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-text mt-8 mb-3">Screen Reader Support</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Semantic HTML structure for clear content organization</li>
                <li>Descriptive alt text for images and album artwork</li>
                <li>ARIA labels for interactive elements</li>
                <li>Announcements for dynamic content updates</li>
                <li>Proper heading hierarchy for easy navigation</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-text mt-8 mb-3">Visual Design</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Sufficient color contrast between text and background</li>
                <li>Text can be resized up to 200% without loss of functionality</li>
                <li>Information is not conveyed by color alone</li>
                <li>Clear, readable fonts with consistent styling</li>
                <li>Responsive design that works on all screen sizes</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-text mt-8 mb-3">Multimedia Accessibility</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Closed captions for video content where possible</li>
                <li>Lyrics provided for music tracks</li>
                <li>Transcripts for audio interviews and podcasts</li>
                <li>Audio descriptions for visual content when applicable</li>
                <li>Controls to pause, stop, or adjust volume</li>
              </ul>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Assistive Technology Compatibility</h2>
              <p className="mb-4">
                Our website is designed to be compatible with commonly used assistive technologies, 
                including:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Alternative input devices and switches</li>
                <li>Browser zoom and text-only modes</li>
              </ul>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Known Limitations</h2>
              <p className="mb-4">
                Despite our best efforts to ensure accessibility, there may be some limitations:
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-semibold text-brand-text mb-2">Third-Party Content</h3>
                <p className="text-sm text-brand-text/70">
                  Some embedded content from third-party platforms (such as external music players 
                  or social media feeds) may not fully meet our accessibility standards. We work 
                  with these providers and advocate for improved accessibility.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <h3 className="font-semibold text-brand-text mb-2">Legacy Content</h3>
                <p className="text-sm text-brand-text/70">
                  Some older archived content may not yet be fully accessible. We are working to 
                  update historical content to meet current accessibility standards.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Feedback and Contact</h2>
              <p className="mb-4">
                We welcome your feedback on the accessibility of our website. If you encounter 
                accessibility barriers, have suggestions for improvement, or need assistance 
                accessing any content, please contact us:
              </p>
              
              <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                <p className="mb-1"><strong>Email:</strong> <a href="mailto:accessibility@staramillion.com" className="text-brand-dark hover:underline">accessibility@staramillion.com</a></p>
                <p className="mb-1"><strong>General Contact:</strong> <a href="mailto:booking@staramillion.com" className="text-brand-dark hover:underline">booking@staramillion.com</a></p>
              </div>

              <p className="mb-4">
                We aim to respond to accessibility feedback within 2 business days and will work 
                to address any issues as quickly as possible.
              </p>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Alternative Formats</h2>
              <p className="mb-4">
                If you need content in an alternative format (large print, audio description, 
                or other accessible format), please contact us and we will do our best to 
                accommodate your request.
              </p>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Ongoing Improvements</h2>
              <p className="mb-4">
                Accessibility is an ongoing effort. We regularly:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Conduct accessibility audits of our website</li>
                <li>Test with assistive technologies</li>
                <li>Incorporate accessibility into our design and development process</li>
                <li>Stay informed about evolving accessibility standards</li>
                <li>Train our team on accessibility best practices</li>
              </ul>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Third-Party Resources</h2>
              <p className="mb-4">
                For additional information about web accessibility, we recommend:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:underline">W3C Web Accessibility Initiative (WAI)</a></li>
                <li><a href="https://webaim.org/" target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:underline">WebAIM</a></li>
                <li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer" className="text-brand-dark hover:underline">ADA.gov</a></li>
              </ul>

              <h2 className="text-2xl font-bold text-brand-text mt-12 mb-4">Statement Updates</h2>
              <p className="mb-4">
                This Accessibility Statement was last updated on January 2025. We regularly review 
                and update this statement as we continue to improve the accessibility of our website.
              </p>

              <div className="bg-brand-primary/10 rounded-xl p-6 mt-12 border border-brand-primary/20">
                <p className="text-brand-text font-medium">
                  Music is for everyone. We are committed to making our website and digital 
                  content accessible to all fans, regardless of ability or technology.
                </p>
              </div>

            </div>

            <div className="mt-16 pt-8 border-t border-brand-text/10 text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-brand-dark font-semibold hover:underline">
                ← Back to Home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
