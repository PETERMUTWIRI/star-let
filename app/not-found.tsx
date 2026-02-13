import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  FaHome,
  FaMusic,
  FaVideo,
  FaCalendarAlt,
  FaEnvelope,
  FaSearch,
  FaCompactDisc,
  FaHeadphones,
  FaMicrophone,
  FaGuitar,
  FaArrowRight
} from 'react-icons/fa';

export const metadata: Metadata = {
  title: 'Page Not Found | Rahab Kinity',
  description: 'The page you are looking for could not be found. Explore Rahab Kinity\'s music, videos, and upcoming events.',
};

// Navigation links configuration
const navigationLinks = [
  { href: '/', label: 'Home', icon: FaHome, description: 'Return to homepage' },
  { href: '/music', label: 'Music', icon: FaMusic, description: 'Explore albums and singles' },
  { href: '/videos', label: 'Videos', icon: FaVideo, description: 'Watch music videos' },
  { href: '/events', label: 'Events', icon: FaCalendarAlt, description: 'Upcoming concerts' },
  { href: '/contact', label: 'Contact', icon: FaEnvelope, description: 'Get in touch' },
];

// Popular content links
const popularContent = [
  { title: 'Latest Album', href: '/music', icon: FaCompactDisc },
  { title: 'New Video Release', href: '/videos', icon: FaVideo },
  { title: 'Live Performance', href: '/events', icon: FaMicrophone },
  { title: 'Behind the Scenes', href: '/blog', icon: FaGuitar },
];

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px]" />
        
        {/* Decorative music notes pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5v25c0 2.5-2 5-5 5s-5-2.5-5-5 2-5 5-5c1.5 0 2.8.7 3.5 1.5V10h15v20c0 2.5-2 5-5 5s-5-2.5-5-5 2-5 5-5c1.5 0 2.8.7 3.5 1.5V5h-12z' fill='%23ffffff' fill-opacity='1'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16" aria-labelledby="error-title">
          {/* 404 Display */}
          <div className="relative mb-8">
            <h1 
              id="error-title"
              className="text-[8rem] sm:text-[10rem] md:text-[12rem] lg:text-[14rem] font-black leading-none tracking-tighter"
              aria-label="404 Error"
            >
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent animate-gradient">
                404
              </span>
            </h1>
            
            {/* Vinyl record decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 opacity-20 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-black border-4 border-slate-700 flex items-center justify-center animate-spin" style={{ animationDuration: '10s' }}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              Looks like this track got lost in the mix
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              The page you&apos;re looking for seems to have skipped a beat. 
              Let&apos;s get you back to the rhythm.
            </p>
          </div>

          {/* Visual equalizer */}
          <div className="flex justify-center items-end gap-1 h-12 mb-12" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="w-2 sm:w-3 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-pulse"
                style={{
                  height: `${Math.max(20, Math.random() * 100)}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${0.8 + Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        </section>

        {/* Search Section */}
        <section className="mb-12" aria-label="Search">
          <div className="max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-300">
                <FaSearch className="w-5 h-5 text-slate-400 ml-4 flex-shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  placeholder="Search for songs, videos, or events..."
                  className="w-full px-4 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                  aria-label="Search the website"
                  readOnly
                />
                <button 
                  className="px-4 py-2 mr-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                  aria-label="Submit search"
                >
                  Search
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-sm text-center mt-3">
              Try searching for your favorite song or album
            </p>
          </div>
        </section>

        {/* Navigation Grid */}
        <nav aria-label="Quick navigation">
          <h3 className="text-center text-slate-300 font-semibold mb-6 text-sm uppercase tracking-widest">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-16">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/10 transition-all duration-300 text-center"
                  aria-label={link.description}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-blue-400 group-hover:text-purple-400 transition-colors" aria-hidden="true" />
                    </div>
                    <span className="text-white font-medium text-sm">{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Popular Content Section */}
        <section aria-labelledby="popular-content-title">
          <h3 
            id="popular-content-title" 
            className="text-center text-slate-300 font-semibold mb-6 text-sm uppercase tracking-widest"
          >
            Popular Right Now
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {popularContent.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 text-purple-400" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{item.title}</p>
                    <p className="text-slate-500 text-xs">Check it out</p>
                  </div>
                  <FaArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <FaHeadphones className="w-5 h-5 text-blue-400" aria-hidden="true" />
            <span className="text-slate-300 text-sm">
              Need help?{' '}
              <Link 
                href="/contact" 
                className="text-blue-400 hover:text-purple-400 transition-colors font-medium"
              >
                Contact us
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
