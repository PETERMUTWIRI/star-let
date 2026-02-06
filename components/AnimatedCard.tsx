'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import Image from 'next/image';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

// 3D Tilt Card
export function TiltCard({ children, className = '' }: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      <div style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

// Hover reveal card
interface HoverRevealCardProps {
  image: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function HoverRevealCard({
  image,
  title,
  subtitle,
  className = '',
}: HoverRevealCardProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl group cursor-pointer ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          {subtitle && (
            <p className="text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Animated line */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </div>
    </motion.div>
  );
}

// Bento Grid Item
interface BentoItemProps {
  children: ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

export function BentoItem({
  children,
  className = '',
  colSpan = 1,
  rowSpan = 1,
}: BentoItemProps) {
  const colSpanClass = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
  };

  const rowSpanClass = {
    1: 'row-span-1',
    2: 'row-span-2',
  };

  return (
    <motion.div
      className={`relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 ${colSpanClass[colSpan]} ${rowSpanClass[rowSpan]} ${className}`}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 pointer-events-none" />
      
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

// Parallax Card
export function ParallaxCard({
  children,
  className = '',
  offset = 50,
}: AnimatedCardProps & { offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      initial={{ y: offset, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
