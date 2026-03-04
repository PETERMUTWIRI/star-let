'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTicketAlt, FaLock, FaSpinner } from 'react-icons/fa';

interface EventTicketFormProps {
  eventId: number;
  eventSlug: string;
  isFree: boolean;
  ticketPrice: string | null;
  ticketPriceCents: number;
  spotsLeft: number | null;
  eventTitle: string;
}

export default function EventTicketForm({
  eventId,
  eventSlug,
  isFree,
  ticketPrice,
  ticketPriceCents,
  spotsLeft,
  eventTitle,
}: EventTicketFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: String(eventId),
          email: formData.email,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to process registration');
      }

      if (data.isFree) {
        // Free event - redirect to success page
        router.push(`/events/${eventSlug}/success?ticket=${data.ticketCode}`);
      } else if (data.checkoutUrl) {
        // Paid event - redirect to Stripe checkout
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <FaTicketAlt className="w-6 h-6 text-amber-400" />
        <h2 className="text-xl font-bold text-white">
          {isFree ? 'Register for Event' : 'Get Tickets'}
        </h2>
      </div>

      {!isFree && ticketPrice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-slate-400">Ticket Price</p>
          <p className="text-3xl font-bold text-amber-400">${ticketPrice}</p>
        </div>
      )}

      {isFree && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 font-semibold">Free Event</p>
          <p className="text-sm text-slate-400">No payment required</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-all"
          />
          <p className="text-xs text-slate-500 mt-1">
            Your ticket will be sent to this email
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : isFree ? (
            'Complete Registration'
          ) : (
            'Proceed to Payment'
          )}
        </button>

        {!isFree && (
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <FaLock className="w-4 h-4" />
            Secure payment powered by Stripe
          </div>
        )}
      </form>
    </div>
  );
}
