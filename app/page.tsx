import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { 
  FaSpotify, 
  FaApple, 
  FaYoutube, 
  FaInstagram, 
  FaTwitter,
  FaTiktok,
  FaPlay,
  FaArrowRight,
} from 'react-icons/fa';
import ScrollReveal from '@/components/ScrollReveal';
import { GradientText } from '@/components/TextScramble';
import HomepageHero from './HomepageHero';
import HomepageEventsSection from './HomepageEventsSection';
import HomepageBlogSection from './HomepageBlogSection';
import HomepageBookingSection from './HomepageBookingSection';

// Force dynamic rendering to get fresh data on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Server-side data fetching
async function getUpcomingEvents() {
  try {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: { 
        deletedAt: null,
        startDate: { gte: now }
      },
      orderBy: { startDate: 'asc' },
      take: 1,
      include: {
        registrations: {
          where: {
            status: { in: ['pending', 'completed'] },
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    return events.map((e) => ({
      id: e.id,
      title: e.title,
      slug: e.slug,
      description: e.description ?? undefined,
      category: e.category,
      cover: e.cover ?? undefined,
      location: e.location,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString(),
      venue: e.venue ?? undefined,
      address: e.address ?? undefined,
      registrationLink: e.registrationLink ?? undefined,
      registrationType: e.registrationType ?? undefined,
      maxAttendees: e.maxAttendees ?? undefined,
      isFree: e.isFree ?? true,
      ticketPrice: e.ticketPrice ?? undefined,
      ticketPriceCents: e.ticketPriceCents ?? undefined,
      registrationCount: e.registrations.length,
      spotsLeft: e.maxAttendees ? e.maxAttendees - e.registrations.length : null,
      isSoldOut: e.maxAttendees ? e.registrations.length >= e.maxAttendees : false,
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

async function getLatestBlogPost() {
  try {
    const post = await prisma.post.findFirst({
      where: {
        published: true,
        deletedAt: null,
        publishedAt: { not: null, lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
    });

    if (!post) return null;

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || post.content.slice(0, 200).replace(/<[^>]*>/g, ''),
      cover: post.cover,
      category: post.category,
      author: post.author,
      publishedAt: post.publishedAt!.toISOString(),
      slug: post.slug,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function HomePage() {
  const upcomingEvents = await getUpcomingEvents();
  const latestBlogPost = await getLatestBlogPost();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section - Client Component */}
      <HomepageHero />

      {/* Latest Release Section - Soul Awakening */}
      <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Artist Image */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-3xl opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden glow-mixed">
                  <Image
                    src="/images/about/Rahab.jpeg"
                    alt="Ray Armillion - Gospel Artist"
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                      <FaPlay className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                  
                  {/* Quote Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/90 text-sm italic font-light">
                      &ldquo;Music that transcends boundaries, touching souls in every language&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Her Story */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="text-gradient">A Journey of Resilience</span>
                  <span className="block text-2xl md:text-3xl text-amber-400 mt-2 font-light italic">
                    From Refugee to Radiant Voice
                  </span>
                </h2>
                
                <div className="space-y-4 text-lg text-slate-300 leading-relaxed">
                  <p>
                    <span className="text-amber-400 font-medium">Ray Armillion</span> brings the vibrant spirit of Kenya to American stages, 
                    weaving traditional <span className="text-cyan-400">Maasai culture</span> into powerful performances that dance between 
                    gospel roots and contemporary sound.
                  </p>
                  
                  <p className="border-l-4 border-amber-500/50 pl-4 italic text-slate-400">
                    &ldquo;Every beat is a testimony. Every song is a bridge—from where I came from to where faith has brought me. 
                    I don&apos;t just sing; I share the story of survival, of hope, of a little girl who dared to dream beyond the refugee camp.&rdquo;
                  </p>
                  
                  <p>
                    A <span className="text-purple-400">cancer survivor</span> with an unbreakable spirit, Rahab creates original music 
                    about <span className="text-purple-400">unity</span>,{' '}
                    <span className="text-purple-400">community</span>, and{' '}
                    <span className="text-purple-400">healing</span>. Whether performing with traditional Maasai attire 
                    or pouring her heart out in worship, her energy is contagious—and her message is universal.
                  </p>
                </div>
                
                
                
                {/* Streaming Platforms */}
                <div className="flex flex-wrap gap-3 pt-4">
                  {[
                    { icon: FaSpotify, name: 'Spotify' },
                    { icon: FaApple, name: 'Apple Music' },
                    { icon: FaYoutube, name: 'YouTube' },
                  ].map((platform) => (
                    <a
                      key={platform.name}
                      href="#"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/10 transition-all"
                    >
                      <platform.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-300">{platform.name}</span>
                    </a>
                  ))}
                </div>

                <Link 
                  href="/music" 
                  className="inline-flex items-center gap-2 text-amber-400 hover:text-purple-400 transition-colors pt-4 group"
                >
                  Experience The Music
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Next Performance / Events Section */}
      <HomepageEventsSection upcomingEvents={upcomingEvents} />

      {/* Blog Section */}
      <HomepageBlogSection latestPost={latestBlogPost} />

      {/* Booking Section - Last Section */}
      <HomepageBookingSection />
    </div>
  );
}
