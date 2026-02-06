'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      
      const startTime = Date.now();
      const durationMs = duration * 1000;

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / durationMs, 1);
        
        // Easing function (ease-out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        setCount(easeOut * end);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isInView, end, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </motion.span>
  );
}

// Counter with label for stats sections
export function StatCard({
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon: Icon,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.div
      className="relative group p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-cyan-500/20 to-purple-500/20" />
      
      <div className="relative z-10">
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mb-4">
            <Icon className="w-6 h-6 text-cyan-400" />
          </div>
        )}
        
        <div className="text-4xl font-bold text-white mb-1">
          <AnimatedCounter 
            end={value} 
            prefix={prefix} 
            suffix={suffix}
            decimals={decimals}
            duration={2.5}
          />
        </div>
        
        <p className="text-gray-400 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
