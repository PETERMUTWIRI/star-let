import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
  typescript: true,
});

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
