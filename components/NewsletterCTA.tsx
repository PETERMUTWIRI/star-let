'use client';

import { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa6';
import { useNewsletter } from '@/lib/hooks/useNewsletter';

interface NewsletterCTAProps {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  buttonText?: string;
}

export default function NewsletterCTA({ 
  title = "Stay up to date with the latest",
  subtitle = "Nihri's hope\nFor Refugees And Immigrants",
  placeholder = "Enter your email address",
  buttonText = "Subscribe"
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { subscribe, loading } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    const result = await subscribe(email);
    
    if (result.success) {
      setStatus('success');
      setMessage(result.message);
      setEmail('');
    } else {
      setStatus('error');
      setMessage(result.message);
    }
  };

  const [line1, line2] = subtitle.split('\n');

  return (
    <section className="relative pt-0 pb-12 px-6 md:px-12 overflow-hidden bg-white">
      {/* Decorative SVG Pattern - Top */}
      <div className="absolute top-0 left-0 right-0 h-24 opacity-100 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          {/* Repeating ornamental bows - scaled */}
          <g fill="#06b6d4">
            {/* First - Larger */}
            <g transform="translate(100, 50) scale(1.5) translate(-100, -50)">
              <path d="M100,40 Q80,20 60,40 Q40,60 60,80 Q80,60 100,40 M100,40 Q120,20 140,40 Q160,60 140,80 Q120,60 100,40"/>
              <circle cx="100" cy="50" r="5" fill="#00a3a3"/>
            </g>
            
            {/* Standard size */}
            <g>
              <path d="M300,40 Q280,20 260,40 Q240,60 260,80 Q280,60 300,40 M300,40 Q320,20 340,40 Q360,60 340,80 Q320,60 300,40"/>
              <circle cx="300" cy="50" r="5" fill="#0891b2"/>
            </g>
            
            {/* Middle (3rd position) - Larger */}
            <g transform="translate(500, 50) scale(1.5) translate(-500, -50)">
              <path d="M500,40 Q480,20 460,40 Q440,60 460,80 Q480,60 500,40 M500,40 Q520,20 540,40 Q560,60 540,80 Q520,60 500,40"/>
              <circle cx="500" cy="50" r="5" fill="#0891b2"/>
            </g>
            
            {/* Standard size */}
            <g>
              <path d="M700,40 Q680,20 660,40 Q640,60 660,80 Q680,60 700,40 M700,40 Q720,20 740,40 Q760,60 740,80 Q720,60 700,40"/>
              <circle cx="700" cy="50" r="5" fill="#0891b2"/>
            </g>
            
            {/* Standard size */}
            <g>
              <path d="M900,40 Q880,20 860,40 Q840,60 860,80 Q880,60 900,40 M900,40 Q920,20 940,40 Q960,60 940,80 Q920,60 900,40"/>
              <circle cx="900" cy="50" r="5" fill="#0891b2"/>
            </g>
            
            {/* Last - Larger */}
            <g transform="translate(1100, 50) scale(1.5) translate(-1100, -50)">
              <path d="M1100,40 Q1080,20 1060,40 Q1040,60 1060,80 Q1080,60 1100,40 M1100,40 Q1120,20 1140,40 Q1160,60 1140,80 Q1120,60 1100,40"/>
              <circle cx="1100" cy="50" r="5" fill="#0891b2"/>
            </g>
          </g>
          
          {/* Decorative dots */}
          <g fill="#00a3a3">
            <circle cx="150" cy="100" r="4"/>
            <circle cx="1050" cy="100" r="4"/>
            <circle cx="200" cy="150" r="3.5"/>
            <circle cx="1000" cy="150" r="3.5"/>
          </g>
        </svg>
      </div>

      {/* Decorative SVG Pattern - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-100 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200" preserveAspectRatio="none">
          {/* Repeating ornamental bows */}
          <g fill="#06b6d4">
            {/* First - Larger */}
            <g transform="translate(100, 150) scale(1.5) translate(-100, -150)">
              <path d="M100,160 Q80,180 60,160 Q40,140 60,120 Q80,140 100,160 M100,160 Q120,180 140,160 Q160,140 140,120 Q120,140 100,160"/>
              <circle cx="100" cy="150" r="5" fill="#0891b2"/>
            </g>
            
            {/* Standard size */}
            <g>
              <path d="M300,160 Q280,180 260,160 Q240,140 260,120 Q280,140 300,160 M300,160 Q320,180 340,160 Q360,140 340,120 Q320,140 300,160"/>
              <circle cx="300" cy="150" r="5" fill="#0891b2"/>
            </g>
            
            {/* Middle (3rd position) - Larger */}
            <g transform="translate(500, 150) scale(1.5) translate(-500, -150)">
              <path d="M500,160 Q480,180 460,160 Q440,140 460,120 Q480,140 500,160 M500,160 Q520,180 540,160 Q560,140 540,120 Q520,140 500,160"/>
              <circle cx="500" cy="150" r="5" fill="#0891b2"/>
            </g>
            
            {/* Standard size */}
            <g>
              <path d="M700,160 Q680,180 660,160 Q640,140 660,120 Q680,140 700,160 M700,160 Q720,180 740,160 Q760,140 740,120 Q720,140 700,160"/>
              <circle cx="700" cy="150" r="5" fill="#0891b2"/>
            </g>
            
            {/* Standard size */}
            <g>
              <path d="M900,160 Q880,180 860,160 Q840,140 860,120 Q880,140 900,160 M900,160 Q920,180 940,160 Q960,140 940,120 Q920,140 900,160"/>
              <circle cx="900" cy="150" r="5" fill="#0891b2"/>
            </g>
            
            {/* Last - Larger */}
            <g transform="translate(1100, 150) scale(1.5) translate(-1100, -150)">
              <path d="M1100,160 Q1080,180 1060,160 Q1040,140 1060,120 Q1080,140 1100,160 M1100,160 Q1120,180 1140,160 Q1160,140 1140,120 Q1120,140 1100,160"/>
              <circle cx="1100" cy="150" r="5" fill="#0891b2"/>
            </g>
          </g>
          
          {/* Decorative dots */}
          <g fill="#0891b2">
            <circle cx="150" cy="100" r="4"/>
            <circle cx="1050" cy="100" r="4"/>
            <circle cx="200" cy="50" r="3.5"/>
            <circle cx="1000" cy="50" r="3.5"/>
          </g>
        </svg>
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto z-10">
        <div className="bg-white rounded-2xl shadow-lg px-8 md:px-16 py-6 md:py-8 border border-brand-primary/20 hover:border-brand-primary/40 transition-colors">
          <div className="mb-6 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-black leading-tight mb-2">
              {title}
            </h2>
            <div className="mb-4">
              <p className="text-2xl md:text-3xl font-extrabold text-black">
                {line1}
              </p>
              <p className="text-lg md:text-xl font-extrabold text-gray-900">
                {line2}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className="flex-1 w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-brand-text placeholder-gray-500 font-medium"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-brand-primary hover:bg-brand-dark text-brand-text font-bold px-8 py-3 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subscribing...' : buttonText} <FaArrowRight className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Status Message */}
          {message && (
            <p className={`text-center text-sm mt-3 font-medium ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}

          <div className="text-center mt-4 space-y-1">
            <p className="text-xs text-gray-600 font-medium tracking-wide">
              We respect your privacy.
            </p>
            <a 
              href="/unsubscribe" 
              className="text-xs text-blue-600 hover:text-blue-800 underline font-medium inline-block"
            >
              Unsubscribe
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
