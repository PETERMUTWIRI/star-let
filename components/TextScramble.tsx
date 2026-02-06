'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const chars = '!<>-_\\/[]{}—=+*^?#________';

interface TextScrambleProps {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextScramble({
  text,
  className = '',
  delay = 0,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  const scramble = useCallback(() => {
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

      iteration += 1;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const timer = setTimeout(() => {
        scramble();
      }, delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, scramble, delay]);

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      {displayText}
    </motion.span>
  );
}

// Typewriter effect
export function Typewriter({
  text,
  className = '',
  speed = 50,
  delay = 0,
}: {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
}) {
  const [displayText, setDisplayText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      const startTimer = setTimeout(() => {
        let currentIndex = 0;
        
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayText(text.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, speed);

        return () => clearInterval(interval);
      }, delay * 1000);

      return () => clearTimeout(startTimer);
    }
  }, [isInView, text, speed, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText}
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
    </span>
  );
}

// Gradient text animation
export function GradientText({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-300% ${className}`}
    >
      {children}
    </span>
  );
}
