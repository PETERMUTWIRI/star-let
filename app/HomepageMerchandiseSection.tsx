'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaArrowRight, FaTag } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  stripeProductId: string | null;
  stripePriceId: string | null;
}

interface HomepageMerchandiseSectionProps {
  featuredProducts: Product[];
}

export default function HomepageMerchandiseSection({ featuredProducts }: HomepageMerchandiseSectionProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Show only first 4 products for homepage
  const displayProducts = featuredProducts.slice(0, 4);

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-6">
            <FaShoppingCart className="w-4 h-4" />
            Official Store
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient">Show Your Support</span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
             Every piece in our collection carries the spirit of hope, resilience, and faith.
            Support the artist while sharing a message that moves hearts.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="group relative bg-slate-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => window.location.href = '/merchandise'}
              >
                {/* Product Image */}
                <div className="aspect-square relative overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-600/20 flex items-center justify-center">
                      <FaTag className="w-16 h-16 text-white/30" />
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <div className="text-center">
                      <FaShoppingCart className="w-8 h-8 text-white mx-auto mb-2" />
                      <span className="text-white font-semibold">View Details</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full">
                      {product.category}
                    </span>
                    <span className="text-lg font-bold text-amber-400">
                      ${product.price}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="text-slate-400 text-xs line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/merchandise"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105"
            >
              <FaShoppingCart className="w-5 h-5" />
              Shop Full Collection
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}