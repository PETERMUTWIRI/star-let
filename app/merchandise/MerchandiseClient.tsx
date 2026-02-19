'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
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
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  console.log('MerchandiseClient received products:', initialProducts.length); // Debug log

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return initialProducts;
    return initialProducts.filter(p => p.category === activeCategory);
  }, [initialProducts, activeCategory]);

  // Auto-select first product when category changes
  useMemo(() => {
    if (filteredProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(filteredProducts[0]);
    } else if (filteredProducts.length > 0 && selectedProduct && !filteredProducts.find(p => p.id === selectedProduct.id)) {
      setSelectedProduct(filteredProducts[0]);
    }
  }, [filteredProducts, selectedProduct]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    // Clear form when switching products
    setCustomerEmail('');
    setCustomerName('');
  };

  const handleCheckout = async () => {
    if (!selectedProduct) return;

    // Validate form
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Please enter your name and email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/stripe/checkout/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selectedProduct.id,
          email: customerEmail,
          name: customerName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setIsProcessing(false);
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

      {/* Products Section */}
      <section className="relative py-10 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Selected Product Display */}
          {selectedProduct && (
            <motion.div
              className="mb-12 bg-slate-900/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="aspect-square relative rounded-2xl overflow-hidden">
                  {selectedProduct.image ? (
                    <Image
                      src={selectedProduct.image}
                      alt={selectedProduct.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center">
                      <span className="text-8xl">🛍️</span>
                    </div>
                  )}
                </div>

                {/* Product Details & Checkout */}
                <div className="flex flex-col justify-center">
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-medium mb-4">
                      {selectedProduct.category}
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                      {selectedProduct.title}
                    </h2>
                    <div className="text-3xl font-bold text-amber-400 mb-4">
                      ${selectedProduct.price}
                    </div>
                    {selectedProduct.description ? (
                      <p className="text-slate-300 text-lg leading-relaxed mb-6">
                        {selectedProduct.description}
                      </p>
                    ) : (
                      <p className="text-slate-500 italic mb-6">
                        No description available
                      </p>
                    )}
                  </div>

                  {/* Checkout Form */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Complete Your Purchase</h3>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaShoppingCart className="w-5 h-5" />
                          Purchase Now - ${selectedProduct.price}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  {activeCategory === 'All' ? 'All Products' : `${activeCategory} Collection`}
                </h2>
                <span className="text-slate-400">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </span>
              </div>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className={`group relative bg-slate-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                      selectedProduct?.id === product.id
                        ? 'border-amber-500/50 shadow-lg shadow-amber-500/20'
                        : 'border-white/10 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10'
                    }`}
                    whileHover={{ y: -4 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image */}
                    <div className="aspect-square relative overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-purple-100 flex items-center justify-center">
                          <span className="text-4xl">🛍️</span>
                        </div>
                      )}

                      {/* Selected Indicator */}
                      {selectedProduct?.id === product.id && (
                        <div className="absolute inset-0 bg-amber-500/20 border-2 border-amber-500 rounded-2xl"></div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                          {product.category}
                        </span>
                      </div>

                      {/* Price Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-bold shadow-lg border border-white/20">
                          ${product.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className={`text-sm font-bold mb-2 line-clamp-2 transition-colors ${
                        selectedProduct?.id === product.id ? 'text-amber-400' : 'text-white group-hover:text-amber-400'
                      }`}>
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-slate-400">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}