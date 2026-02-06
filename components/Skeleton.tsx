'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}

// Blog post skeleton
export function BlogPostSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[400px] w-full rounded-2xl" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
}

// Event card skeleton
export function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <Skeleton className="h-64 w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="pt-2 flex gap-3">
          <Skeleton className="h-12 w-32" />
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  );
}

// Hero skeleton
export function HeroSkeleton() {
  return (
    <div className="min-h-screen bg-cyan-50/30 flex items-center">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40" />
              <Skeleton className="h-14 w-40" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full rounded-2xl hidden lg:block" />
        </div>
      </div>
    </div>
  );
}

// Stats skeleton
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center space-y-2">
          <Skeleton className="h-12 w-20 mx-auto" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Card grid skeleton
export function CardGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
          <Skeleton className="h-48 w-full" />
          <div className="p-5 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
