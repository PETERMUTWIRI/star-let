'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MusicVisualizerProps {
  isPlaying?: boolean;
  barCount?: number;
  className?: string;
}

export default function MusicVisualizer({ 
  isPlaying = true, 
  barCount = 5,
  className = '' 
}: MusicVisualizerProps) {
  const [bars, setBars] = useState<number[]>([]);

  useEffect(() => {
    // Generate random heights for bars
    const generateBars = () => {
      return Array.from({ length: barCount }, () => Math.random() * 0.7 + 0.3);
    };

    if (isPlaying) {
      setBars(generateBars());
      const interval = setInterval(() => {
        setBars(generateBars());
      }, 150);
      return () => clearInterval(interval);
    } else {
      setBars(Array(barCount).fill(0.3));
    }
  }, [isPlaying, barCount]);

  return (
    <div className={`flex items-end gap-[2px] h-6 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-1 bg-gradient-to-t from-cyan-400 to-purple-500 rounded-full"
          animate={{
            height: isPlaying ? `${height * 100}%` : '20%',
          }}
          transition={{
            duration: 0.15,
            ease: 'easeInOut',
          }}
          style={{
            opacity: 0.8 + height * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// Animated equalizer for hero section
export function Equalizer({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end gap-1 h-16 ${className}`}>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-cyan-400 via-purple-500 to-pink-500 rounded-full"
          animate={{
            height: ['20%', '80%', '40%', '100%', '30%'],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Sound wave animation
export function SoundWave({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] bg-cyan-400/60 rounded-full"
          animate={{
            height: [8, 24, 12, 32, 8],
            opacity: [0.4, 1, 0.6, 1, 0.4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.08,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
