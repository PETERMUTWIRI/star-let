'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaTicketAlt, FaSpinner } from 'react-icons/fa';

interface EventCheckoutButtonProps {
  eventId: number;
  eventTitle: string;
  isFree: boolean;
  ticketPrice?: string;
  isSoldOut?: boolean;
}

export default function EventCheckoutButton({
  eventId,
  eventTitle,
  isFree,
  ticketPrice,
  isSoldOut = false,
}: EventCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    // For demo purposes - collect email/name
    // In production, use a modal or redirect to login
    const email = prompt('Enter your email:');
    if (!email) return;

    const name = prompt('Enter your name:');
    if (!name) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: String(eventId),
          email,
          name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.isFree) {
        // Free event - redirect to success
        router.push(`/tickets/success?registration_id=${data.registrationId}`);
      } else if (data.checkoutUrl) {
        // Paid event - redirect to Stripe
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSoldOut) {
    return (
      <button
        disabled
        className="w-full py-3 px-6 rounded-full bg-slate-700 text-slate-400 font-semibold cursor-not-allowed flex items-center justify-center gap-2"
      >
        Sold Out
      </button>
    );
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`w-full py-3 px-6 rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
        isFree
          ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg hover:shadow-green-500/25'
          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/25'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <>
          <FaSpinner className="w-5 h-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <FaTicketAlt className="w-5 h-5" />
          {isFree ? 'Register Free' : `Get Tickets ${ticketPrice || ''}`}
        </>
      )}
    </button>
  );
}
