// app/merchandise/success/page.tsx - Merchandise checkout success handler
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { stripe, isStripeConfigured } from '@/lib/stripe';
import Link from 'next/link';
import PrintReceiptButton from '@/components/PrintReceiptButton';

interface SuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

async function verifyPurchase(sessionId: string) {
  try {
    if (!isStripeConfigured()) {
      return { error: 'Payment service not configured' };
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    });

    if (session.payment_status !== 'paid') {
      return { error: 'Payment not completed' };
    }

    const { productId, customerEmail, customerName, productTitle, productPrice } = session.metadata || {};

    if (!productId || !customerEmail || !customerName) {
      return { error: 'Invalid session metadata' };
    }

    return {
      session,
      productId: parseInt(productId),
      customerEmail,
      customerName,
      productTitle,
      productPrice: parseInt(productPrice),
    };
  } catch (error) {
    console.error('Error verifying purchase:', error);
    return { error: 'Failed to verify purchase' };
  }
}

function SuccessContent({ sessionId }: { sessionId: string }) {
  // This will be handled by the async component below
  return null;
}

async function SuccessPageContent({ sessionId }: { sessionId: string }) {
  const result = await verifyPurchase(sessionId);

  if ('error' in result) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Payment Error</h1>
          <p className="text-slate-400 mb-8">{result.error}</p>
          <Link
            href="/merchandise"
            className="bg-amber-500 text-black px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  const { session, productId, customerEmail, customerName, productTitle, productPrice } = result;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-green-400 mb-4">Purchase Successful!</h1>
          <p className="text-slate-400 text-lg">
            Thank you for supporting Ray Armillion. Your merchandise is on its way!
          </p>
        </div>

        {/* Purchase Details */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 mb-8">
          <h2 className="text-2xl font-bold mb-6">Purchase Details</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-2 text-slate-300">
                <p><span className="font-medium">Name:</span> {customerName}</p>
                <p><span className="font-medium">Email:</span> {customerEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product Information</h3>
              <div className="space-y-2 text-slate-300">
                <p><span className="font-medium">Product:</span> {productTitle}</p>
                <p><span className="font-medium">Price:</span> ${(productPrice / 100).toFixed(2)}</p>
                <p><span className="font-medium">Order ID:</span> {session.id.slice(-8).toUpperCase()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-amber-400 mb-4">Shipping Information</h3>
          <p className="text-slate-300">
            Your merchandise will be shipped within 3-5 business days. You will receive a shipping confirmation
            email with tracking information once your order ships.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <PrintReceiptButton
            sessionId={sessionId}
            type="merchandise"
            productTitle={productTitle}
            customerName={customerName}
            customerEmail={customerEmail}
            amount={productPrice}
          />
          <Link
            href="/merchandise"
            className="bg-slate-700 text-white px-8 py-3 rounded-lg hover:bg-slate-600 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="bg-amber-500 text-black px-8 py-3 rounded-lg hover:bg-amber-600 transition-colors text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect('/merchandise');
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    }>
      <SuccessPageContent sessionId={sessionId} />
    </Suspense>
  );
}