'use client';

import { useState, useCallback } from 'react';
import { Loader2, Ticket, CheckCircle, AlertCircle } from 'lucide-react';

interface TicketButtonProps {
  eventId: string;
  isFree?: boolean;
  price?: number;
  soldOut?: boolean;
  onClick?: () => Promise<void> | void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

type ButtonState = 'idle' | 'loading' | 'success' | 'error';

export default function TicketButton({
  eventId,
  isFree = false,
  price = 0,
  soldOut = false,
  onClick,
  className = '',
  size = 'md',
}: TicketButtonProps) {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = useCallback(async () => {
    if (soldOut || buttonState === 'loading') return;

    setButtonState('loading');
    setErrorMessage('');

    try {
      if (onClick) {
        await onClick();
      }
      setButtonState('success');
      
      // Reset to idle after showing success
      setTimeout(() => {
        setButtonState('idle');
      }, 2000);
    } catch (error) {
      setButtonState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong'
      );
      
      // Reset to idle after showing error
      setTimeout(() => {
        setButtonState('idle');
        setErrorMessage('');
      }, 3000);
    }
  }, [onClick, soldOut, buttonState]);

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Sold Out State
  if (soldOut) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg 
          bg-gray-300 text-gray-500 cursor-not-allowed
          ${sizeClasses[size]} ${className}`}
        aria-disabled="true"
      >
        <Ticket className={iconSizes[size]} />
        Sold Out
      </button>
    );
  }

  // Success State
  if (buttonState === 'success') {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg 
          bg-green-500 text-white
          ${sizeClasses[size]} ${className}`}
        aria-label="Success"
      >
        <CheckCircle className={iconSizes[size]} />
        {isFree ? 'Ticket Reserved!' : 'Added to Cart!'}
      </button>
    );
  }

  // Error State
  if (buttonState === 'error') {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg 
          bg-destructive text-destructive-foreground hover:bg-destructive/90
          transition-all duration-200 hover:scale-105
          ${sizeClasses[size]} ${className}`}
        aria-label="Error - Click to retry"
        title={errorMessage}
      >
        <AlertCircle className={iconSizes[size]} />
        Try Again
      </button>
    );
  }

  // Free Ticket State
  if (isFree) {
    return (
      <button
        onClick={handleClick}
        disabled={buttonState === 'loading'}
        className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg 
          bg-green-500 hover:bg-green-600 text-white
          transition-all duration-200 hover:scale-105 hover:shadow-lg
          disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
          ${sizeClasses[size]} ${className}`}
        aria-label="Get free ticket"
      >
        {buttonState === 'loading' ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Ticket className={iconSizes[size]} />
        )}
        {buttonState === 'loading' ? 'Processing...' : 'Get Free Ticket'}
      </button>
    );
  }

  // Paid Ticket State
  return (
    <button
      onClick={handleClick}
      disabled={buttonState === 'loading'}
      className={`inline-flex items-center justify-center gap-2 font-semibold rounded-lg 
        bg-brand-primary hover:bg-brand-dark text-brand-text
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
        ${sizeClasses[size]} ${className}`}
      aria-label={`Buy tickets for $${(price / 100).toFixed(2)}`}
    >
      {buttonState === 'loading' ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        <Ticket className={iconSizes[size]} />
      )}
      {buttonState === 'loading'
        ? 'Processing...'
        : `Buy Tickets - $${(price / 100).toFixed(2)}`}
    </button>
  );
}

// Alternative compact version for event cards
export function TicketButtonCompact({
  eventId,
  isFree = false,
  price = 0,
  soldOut = false,
  onClick,
  className = '',
}: Omit<TicketButtonProps, 'size'>) {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');

  const handleClick = useCallback(async () => {
    if (soldOut || buttonState === 'loading') return;

    setButtonState('loading');

    try {
      if (onClick) {
        await onClick();
      }
      setButtonState('success');
      setTimeout(() => setButtonState('idle'), 2000);
    } catch (error) {
      setButtonState('error');
      setTimeout(() => setButtonState('idle'), 3000);
    }
  }, [onClick, soldOut, buttonState]);

  if (soldOut) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 ${className}`}>
        <Ticket className="w-4 h-4" />
        Sold Out
      </span>
    );
  }

  if (buttonState === 'success') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium text-green-500 ${className}`}>
        <CheckCircle className="w-4 h-4" />
        Added!
      </span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={buttonState === 'loading'}
      className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors
        ${isFree 
          ? 'text-green-500 hover:text-green-600' 
          : 'text-brand-text hover:text-brand-dark'
        }
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}`}
    >
      {buttonState === 'loading' ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Ticket className="w-4 h-4" />
      )}
      {isFree 
        ? 'Free' 
        : `$${(price / 100).toFixed(2)}`
      }
    </button>
  );
}
