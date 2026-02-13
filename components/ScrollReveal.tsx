'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  once?: boolean;
}

const directionVariants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -60 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

// Hook to detect reduced motion preference
function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });
  const reducedMotion = useReducedMotion();

  // If reduced motion is preferred, just fade in without movement
  const variants = reducedMotion 
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : directionVariants[direction];

  const transition = reducedMotion
    ? { duration: 0.2, delay: 0 }
    : {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] as const, // Custom easing for premium feel
      };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Container for child animations
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reducedMotion = useReducedMotion();

  const transition = reducedMotion
    ? { staggerChildren: 0 }
    : { staggerChildren: staggerDelay };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger Item for use inside StaggerContainer
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up',
}: StaggerItemProps) {
  const reducedMotion = useReducedMotion();

  const variants = reducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : directionVariants[direction];

  const transition = reducedMotion
    ? { duration: 0.2 }
    : { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Fade In variant
export function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reducedMotion = useReducedMotion();

  const transition = reducedMotion
    ? { duration: 0.2, delay: 0 }
    : { duration: 0.8, delay, ease: 'easeOut' as const };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Scale In variant
export function ScaleIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const reducedMotion = useReducedMotion();

  const animate = reducedMotion
    ? { opacity: 1 }
    : { opacity: 1, scale: 1 };

  const initial = reducedMotion
    ? { opacity: 0 }
    : { opacity: 0, scale: 0.9 };

  const transition = reducedMotion
    ? { duration: 0.2, delay: 0 }
    : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? animate : initial}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
