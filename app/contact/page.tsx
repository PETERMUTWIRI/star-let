'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWhatsapp, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaPaperPlane,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaFacebook
} from 'react-icons/fa';
import ScrollReveal from '@/components/ScrollReveal';
import { MusicGroupSchema, BreadcrumbSchema } from '@/components/StructuredData';

const WHATSAPP_NUMBER = '+19194498913';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format message for WhatsApp
    const message = `*New Message from Website*%0A%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Subject:* ${formData.subject}%0A%0A` +
      `*Message:*%0A${formData.message}`;

    // Open WhatsApp with the message
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: FaWhatsapp,
      label: 'WhatsApp',
      value: WHATSAPP_NUMBER,
      href: `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`,
      color: 'text-green-400',
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'booking@rahabkinity.com',
      href: 'mailto:booking@rahabkinity.com',
      color: 'text-blue-400',
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+1 (919) 449-8913',
      href: 'tel:+19194498913',
      color: 'text-amber-400',
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'United States',
      href: '#',
      color: 'text-red-400',
    },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: FaFacebook, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-sky-500' },
    { icon: FaYoutube, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: FaTiktok, href: '#', label: 'TikTok', color: 'hover:text-purple-500' },
  ];

  return (
    <>
      <MusicGroupSchema />
      <BreadcrumbSchema items={[
        { name: 'Home', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]} />

      <div className="relative min-h-screen bg-slate-950">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-amber-400 text-sm font-medium mb-6">
                  <FaEnvelope className="w-4 h-4" />
                  Get In Touch
                </span>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
                  Let&apos;s{' '}
                  <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 bg-clip-text text-transparent">
                    Connect
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Have a question, booking inquiry, or just want to say hello? 
                  Reach out and we&apos;ll get back to you as soon as possible.
                </p>
              </motion.div>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Contact Info - Left Side */}
              <div className="lg:col-span-2 space-y-8">
                <ScrollReveal>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">
                      Contact Information
                    </h2>
                    <p className="text-slate-400">
                      Fill out the form and your message will be sent directly via WhatsApp for a quick response.
                    </p>
                  </div>
                </ScrollReveal>

                {/* Contact Details */}
                <div className="space-y-4">
                  {contactInfo.map((item, index) => (
                    <ScrollReveal key={item.label} delay={index * 0.1}>
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all group"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">{item.label}</p>
                          <p className="text-white font-medium group-hover:text-amber-400 transition-colors">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Social Links */}
                <ScrollReveal delay={0.4}>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-slate-500 text-sm mb-4">Follow on social media</p>
                    <div className="flex gap-3">
                      {socialLinks.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          aria-label={social.label}
                          className={`w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 ${social.color} hover:border-current transition-all`}
                        >
                          <social.icon className="w-5 h-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              {/* Contact Form - Right Side */}
              <div className="lg:col-span-3">
                <ScrollReveal>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 rounded-3xl blur opacity-20" />
                    <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">
                        Send a Message
                      </h3>
                      
                      <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name & Email Row */}
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="John Doe"
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="john@example.com"
                              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-slate-400 mb-2">
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                            style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1.5rem',
                            }}
                          >
                            <option value="" className="bg-slate-900">Select a subject</option>
                            <option value="Booking Inquiry" className="bg-slate-900">Booking Inquiry</option>
                            <option value="Event Collaboration" className="bg-slate-900">Event Collaboration</option>
                            <option value="Media & Press" className="bg-slate-900">Media & Press</option>
                            <option value="General Question" className="bg-slate-900">General Question</option>
                            <option value="Fan Message" className="bg-slate-900">Fan Message</option>
                          </select>
                        </div>

                        {/* Message */}
                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">
                            Your Message
                          </label>
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Tell us about your event, question, or message..."
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                          <FaWhatsapp className="w-5 h-5" />
                          {isSubmitting ? 'Sending...' : 'Send via WhatsApp'}
                          <FaPaperPlane className="w-4 h-4" />
                        </button>

                        <p className="text-center text-slate-500 text-sm">
                          Clicking send will open WhatsApp with your message pre-filled.
                        </p>
                      </form>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-16 px-4 sm:px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked <span className="text-gradient">Questions</span>
              </h2>
            </ScrollReveal>

            <div className="space-y-4">
              {[
                {
                  q: 'How do I book Rahab for an event?',
                  a: 'Fill out the contact form above with your event details, or reach out directly via WhatsApp. Include the date, venue, type of event, and any specific requirements.',
                },
                {
                  q: 'What types of events does Rahab perform at?',
                  a: 'Rahab performs at concerts, worship services, corporate events, community celebrations, fundraisers, and cultural events. She tailors each performance to the audience and occasion.',
                },
                {
                  q: 'How far in advance should I book?',
                  a: 'We recommend booking at least 2-3 months in advance for the best availability. For larger events or tours, 6 months or more is preferred.',
                },
                {
                  q: 'Is international booking available?',
                  a: 'Yes! Rahab is available for international performances. Please include travel and accommodation details in your inquiry.',
                },
              ].map((faq, index) => (
                <ScrollReveal key={index} delay={index * 0.1}>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-400">{faq.a}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
