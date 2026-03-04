import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors
function createStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    // Return a dummy client that throws on actual usage
    return new Proxy({} as Stripe, {
      get() {
        throw new Error('STRIPE_SECRET_KEY is not set');
      },
    });
  }
  return new Stripe(key, {
    apiVersion: '2026-01-28.clover',
    typescript: true,
  });
}

export const stripe = createStripeClient();

// Helper to check if properly configured
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function formatAmountForStripe(amount: number, currency: string): number {
  let zeroDecimalCurrency = true;
  
  // List of zero-decimal currencies
  const zeroDecimalCurrencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
  
  if (!zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    zeroDecimalCurrency = false;
  }
  
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export function formatAmountFromStripe(amount: number, currency: string): number {
  let zeroDecimalCurrency = true;
  
  const zeroDecimalCurrencies = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'];
  
  if (!zeroDecimalCurrencies.includes(currency.toUpperCase())) {
    zeroDecimalCurrency = false;
  }
  
  return zeroDecimalCurrency ? amount : amount / 100;
}
