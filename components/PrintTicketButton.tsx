'use client';

interface PrintTicketButtonProps {
  variant?: 'dark' | 'light';
  label?: string;
}

export default function PrintTicketButton({ variant = 'dark', label = 'Print Ticket' }: PrintTicketButtonProps) {
  const styles = variant === 'dark' 
    ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';

  return (
    <button
      onClick={() => window.print()}
      className={`flex-1 inline-flex items-center justify-center px-6 py-3 rounded-xl border transition-all ${styles}`}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {label}
    </button>
  );
}
