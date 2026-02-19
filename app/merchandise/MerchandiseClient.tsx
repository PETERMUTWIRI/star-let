'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShoppingCart, FaEye, FaFilter } from 'react-icons/fa';
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal';

export interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  category: string;
  image: string | null;
  stripeProductId: string | null;
  stripePriceId: string | null;
}

interface MerchandiseClientProps {
  initialProducts: Product[];
}

const categories = ['All', 'T-Shirts', 'Caps', 'Accessories', 'Maasai Collection'];

export default function MerchandiseClient({ initialProducts }: MerchandiseClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('MerchandiseClient received products:', initialProducts.length); // Debug log

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return initialProducts;
    return initialProducts.filter(p => p.category === activeCategory);
  }, [initialProducts, activeCategory]);

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setShowCheckoutModal(true);
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;

    setIsProcessing(true);
    try {
      const response = await fetch('/api/stripe/checkout/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          email: customerEmail || undefined,
          name: customerName || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowCheckoutModal(false);
      setSelectedProduct(null);
      setCustomerEmail('');
      setCustomerName('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-6"
              >
                <FaShoppingCart className="w-4 h-4" />
                Official Store
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6"
              >
                <span className="text-gradient">Share Inspiration.</span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl text-slate-300 font-light">
                  Ray Armillion Collection
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-400 max-w-3xl mx-auto mb-8"
              >
                Every piece carries the spirit of hope and transformation. From powerful performances at historic gatherings to intimate moments that inspire change. Our collection tells stories of resilience and faith. When you wear Ray Armillion, you&apos;re not just supporting an artist—you&apos;re amplifying a voice that brings hope, healing, and inspiration .
              </motion.p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Filter */}
      <section className="relative py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-lg shadow-amber-500/25'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:border-amber-500/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative py-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group relative bg-slate-900/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10"
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Product Image */}
                  <div className="aspect-square relative overflow-hidden">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center">
                        <span className="text-6xl">🛍️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-600 transition-colors"
                      >
                        <FaEye className="w-6 h-6 text-white" />
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                        {product.category}
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-lg font-bold shadow-lg border-2 border-white/20">
                        ${product.price}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                      {product.title}
                    </h3>
                    {product.description ? (
                      <p className="text-sm text-slate-300 mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500 mb-4 italic">
                        No description available
                      </p>
                    )}
                    <button
                      onClick={() => handlePurchase(product)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:shadow-lg shadow-amber-500/25 transition-all"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      Add to Cart - ${product.price}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute -top-12 right-0 text-white hover:text-amber-400 transition-colors p-2 z-10"
                aria-label="Close product"
              >
                ✕
              </button>

              {/* Product Details */}
              <div className="bg-slate-900 rounded-3xl overflow-hidden">
                {/* Image */}
                <div className="aspect-square relative">
                  {selectedProduct.image ? (
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center">
                      <span className="text-8xl">🛍️</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-amber-400 font-semibold text-xl mb-4">
                    ${selectedProduct.price}
                  </p>
                  {selectedProduct.description && (
                    <p className="text-slate-300 mb-6">
                      {selectedProduct.description}
                    </p>
                  )}
                  <button
                    onClick={() => handlePurchase(selectedProduct)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:shadow-lg shadow-amber-500/25 transition-all"
                  >
                    <FaShoppingCart className="w-4 h-4" />
                    Purchase Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckoutModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCheckoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-4">Complete Your Purchase</h3>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Purchase $${selectedProduct.price}`}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}