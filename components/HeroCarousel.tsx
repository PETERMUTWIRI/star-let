'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  { type: 'image', src: '/images/programs/advocacy2.png', alt: 'Advocacy Program' },
  { type: 'image', src: '/images/programs/advocacy4.png', alt: 'Community Support' },
  { type: 'image', src: '/images/programs/advocacy5.png', alt: 'Advocacy Work' },
  { type: 'image', src: '/images/programs/health5.png', alt: 'Health Services' },
  { type: 'video', videoId: '6bfSEk_oX60', alt: 'Our Story Video' },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const currentSlide = slides[currentIndex];
  const autoplayUrl = currentSlide.type === 'video' 
    ? `https://www.youtube.com/embed/${currentSlide.videoId}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1&loop=1&playlist=${currentSlide.videoId}`
    : null;

  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-video"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Content */}
      <AnimatePresence mode="wait">
        {currentSlide.type === 'image' ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={currentSlide.src!}
              alt={currentSlide.alt}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        ) : (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 bg-black"
          >
            <iframe
              src={autoplayUrl!}
              title={currentSlide.alt}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute inset-0 w-full h-full"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient Overlay (only for images) */}
      {currentSlide.type === 'image' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      )}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70 w-2.5'
            } ${slide.type === 'video' ? 'ring-2 ring-brand-primary' : ''}`}
            aria-label={`Go to ${slide.type === 'video' ? 'video' : 'slide'} ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter & Type Indicator */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-2 z-10">
        {currentSlide.type === 'video' && <span className="text-brand-primary">▶</span>}
        <span>{currentIndex + 1} / {slides.length}</span>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all z-10"
        style={{ opacity: isPaused ? 1 : 0.7 }}
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all z-10"
        style={{ opacity: isPaused ? 1 : 0.7 }}
        aria-label="Next slide"
      >
        →
      </button>
    </div>
  );
}
