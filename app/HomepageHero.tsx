'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  FaPlay,
  FaHeadphones,
  FaArrowRight,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { GlowButton } from '@/components/MagneticButton';

// ============================================================================
// TYPES
// ============================================================================
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  pulsePhase: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const PARTICLE_COUNT = 60;
const COLORS = [
  'rgba(251, 191, 36, 0.6)',   // amber-400
  'rgba(245, 158, 11, 0.5)',   // amber-500
  'rgba(217, 70, 239, 0.5)',   // fuchsia-500
  'rgba(168, 85, 247, 0.5)',   // purple-500
  'rgba(236, 72, 153, 0.4)',   // pink-500
  'rgba(251, 146, 60, 0.5)',   // orange-400
];

const TAGLINES = ['Heritage', 'Healing', 'Hope'];

// ============================================================================
// SCRAMBLE TEXT COMPONENT
// ============================================================================
function ScrambleText({ 
  text, 
  className = '',
  trigger = true,
}: { 
  text: string; 
  className?: string;
  trigger?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
  useEffect(() => {
    if (!trigger) return;
    
    let iteration = 0;
    const maxIterations = text.length * 3;
    
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 3) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      
      iteration++;
      
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, trigger]);
  
  return <span className={className}>{displayText}</span>;
}

// ============================================================================
// PARTICLE SYSTEM COMPONENT
// ============================================================================
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const initParticles = useCallback((width: number, height: number) => {
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.5 + 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let frameCount = 0;
    const animate = () => {
      frameCount++;
      // Render every 2nd frame for performance (30fps)
      if (frameCount % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const time = Date.now() * 0.001;

      ctx.clearRect(0, 0, width, height);

      particlesRef.current.forEach((particle) => {
        // Gentle floating motion with sine waves
        particle.x += particle.speedX + Math.sin(time + particle.pulsePhase) * 0.3;
        particle.y += particle.speedY + Math.cos(time + particle.pulsePhase * 0.5) * 0.2;

        // Mouse interaction - gentle repulsion
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.02;
          particle.x -= dx * force;
          particle.y -= dy * force;
        }

        // Wrap around screen
        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        // Pulsing opacity
        const pulseOpacity = particle.opacity + Math.sin(time * 2 + particle.pulsePhase) * 0.2;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${Math.max(0.1, Math.min(0.8, pulseOpacity))})`);
        ctx.fill();

        // Draw glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, particle.color.replace(/[\d.]+\)$/, '0.3)'));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw connections between nearby particles
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.08)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particlesRef.current.length; i += 2) { // Skip every other for performance
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j += 3) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(251, 191, 36, ${0.08 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

// ============================================================================
// AFRICAN PATTERN BACKGROUND
// ============================================================================
function AfricanPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="african-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* Mud cloth-inspired geometric pattern */}
            <rect x="10" y="10" width="20" height="20" fill="currentColor" />
            <rect x="50" y="10" width="20" height="20" fill="currentColor" />
            <rect x="10" y="50" width="20" height="20" fill="currentColor" />
            <rect x="50" y="50" width="20" height="20" fill="currentColor" />
            <circle cx="40" cy="40" r="8" fill="currentColor" />
            <line x1="0" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="1" />
            <line x1="40" y1="0" x2="40" y2="80" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#african-pattern)" />
      </svg>
    </div>
  );
}

// ============================================================================
// MAIN HERO COMPONENT
// ============================================================================
export default function HomepageHero() {
  const [currentTagline, setCurrentTagline] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for parallax
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to parallax offset (subtle movement)
  const imageX = useTransform(smoothMouseX, [-0.5, 0.5], [15, -15]);
  const imageY = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const textX = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  // Tagline rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % TAGLINES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse move handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950"
    >
      {/* ==========================================================================
          BACKGROUND LAYERS
          ========================================================================== */}
      
      {/* Base gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-amber-500/20 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-purple-600/20 rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* African geometric pattern */}
      <AfricanPattern />

      {/* Particle system */}
      <ParticleField />

      {/* ==========================================================================
          MAIN CONTENT
          ========================================================================== */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 pt-20 sm:pt-24 lg:pt-0 pb-8 lg:pb-0">
          <div className="grid lg:grid-cols-2 gap-4 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Text Content */}
            <motion.div 
              style={{ x: textX }}
              className="order-2 lg:order-1 text-center lg:text-left"
            >
              {/* Pre-title Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm text-slate-300 tracking-wider uppercase">
                  Recording Artist & Producer
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4"
              >
                <span className="block text-white">RAY</span>
                <span className="block bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 bg-clip-text text-transparent">
                  ARMILLION
                </span>
              </motion.h1>

              {/* Animated Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="h-16 sm:h-20 flex items-center justify-center lg:justify-start mb-6"
              >
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentTagline}
                      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl sm:text-4xl md:text-5xl font-light text-amber-400/90 tracking-wide"
                    >
                      <ScrambleText 
                        text={TAGLINES[currentTagline]} 
                        trigger={true}
                      />
                    </motion.span>
                  </AnimatePresence>
                  
                  {/* Decorative line under tagline */}
                  <motion.div 
                    className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="text-slate-400 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Kenyan-American artist weaving <span className="text-amber-400">Maasai heritage</span> into 
                powerful gospel performances that transcend boundaries and heal souls.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link href="/music">
                  <GlowButton variant="primary" className="group w-full sm:w-auto">
                    <FaHeadphones className="w-5 h-5 inline mr-2" />
                    Listen Now
                    <FaArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-1 transition-transform" />
                  </GlowButton>
                </Link>
                <Link href="/videos">
                  <GlowButton variant="secondary" className="group w-full sm:w-auto">
                    <FaPlay className="w-4 h-4 inline mr-2" />
                    Watch Videos
                  </GlowButton>
                </Link>
              </motion.div>


            </motion.div>

            {/* RIGHT COLUMN: Image with Parallax */}
            <motion.div 
              className="order-1 lg:order-2 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative w-full aspect-[4/5] max-w-lg mx-auto lg:max-w-none">
                {/* Glow effect behind image */}
                <motion.div 
                  animate={{ 
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-amber-500/30 via-purple-600/30 to-fuchsia-500/30 rounded-3xl blur-3xl" 
                />
                
                {/* Main image container with parallax */}
                <motion.div 
                  style={{ x: imageX, y: imageY }}
                  className="relative w-full h-full rounded-3xl overflow-hidden"
                >
                  {/* Image frame with gradient border */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/50 via-purple-600/50 to-fuchsia-500/50 p-[2px]">
                    <div className="w-full h-full rounded-3xl overflow-hidden bg-slate-950">
                      <Image
                        src="/images/hero/Rahab_flag.jpeg"
                        alt="Ray Armillion - Gospel Artist"
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      
                      {/* Subtle overlay for text contrast if needed */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Floating badge - Kenya */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    className="absolute top-6 left-6 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-white/10"
                  >
                    <span className="flex items-center gap-2 text-sm text-white">
                      
                    </span>
                  </motion.div>

                  {/* Floating badge - Cancer Survivor */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: 1.6 }}
                    className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 backdrop-blur-md border border-white/20"
                  >
                    <span className="flex items-center gap-2 text-sm text-white font-medium">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      
                    </span>
                  </motion.div>
                </motion.div>

                {/* Decorative rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-8 border border-amber-500/10 rounded-full pointer-events-none"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-12 border border-purple-500/10 rounded-full pointer-events-none"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      

      {/* ==========================================================================
          SCROLL INDICATOR
          ========================================================================== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ delay: 2 }}
        className="absolute bottom-32 sm:bottom-28 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-xs text-slate-500 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-slate-700 flex justify-center pt-2"
        >
          <motion.div 
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-gradient-to-b from-amber-400 to-purple-400 rounded-full" 
          />
        </motion.div>
      </motion.div>
    </section>
  );
}


