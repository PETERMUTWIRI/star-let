'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 200px
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-[80px] md:top-[100px] left-0 right-0 h-1 bg-gray-200 z-50 origin-left"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-brand-primary to-cyan-500"
        style={{ scaleX }}
      />
    </motion.div>
  );
}
