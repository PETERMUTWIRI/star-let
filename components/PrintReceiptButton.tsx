'use client';

import { useState } from 'react';

interface PrintReceiptButtonProps {
  sessionId: string;
  type: 'event' | 'merchandise';
  productTitle?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  variant?: 'dark' | 'light';
  label?: string;
}

export default function PrintReceiptButton({
  sessionId,
  type,
  productTitle,
  customerName,
  customerEmail,
  amount,
  variant = 'dark',
  label = 'Print Receipt'
}: PrintReceiptButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = variant === 'dark'
    ? 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:border-white/20'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';

  const handlePrint = async () => {
    setIsGenerating(true);
    try {
      // Create a printable receipt
      const receiptWindow = window.open('', '_blank', 'width=800,height=600');
      if (!receiptWindow) return;

      const receiptHTML = generateReceiptHTML({
        sessionId,
        type,
        productTitle,
        customerName,
        customerEmail,
        amount,
      });

      receiptWindow.document.write(receiptHTML);
      receiptWindow.document.close();

      // Wait for content to load then print
      receiptWindow.onload = () => {
        receiptWindow.print();
        receiptWindow.close();
      };
    } catch (error) {
      console.error('Error generating receipt:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handlePrint}
      disabled={isGenerating}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles}`}
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      {isGenerating ? 'Generating...' : label}
    </button>
  );
}

function generateReceiptHTML({
  sessionId,
  type,
  productTitle,
  customerName,
  customerEmail,
  amount,
}: {
  sessionId: string;
  type: 'event' | 'merchandise';
  productTitle?: string;
  customerName: string;
  customerEmail: string;
  amount: number;
}) {
  const title = type === 'event' ? 'Event Registration Receipt' : 'Merchandise Purchase Receipt';
  const itemLabel = type === 'event' ? 'Event' : 'Product';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          color: black;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #f59e0b;
          margin-bottom: 10px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .details {
          margin-bottom: 30px;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        .total {
          font-weight: bold;
          font-size: 16px;
          border-top: 2px solid #333;
          margin-top: 20px;
          padding-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">RAY ARMILLION</div>
        <div class="title">${title}</div>
        <div>Order ID: ${sessionId.slice(-8).toUpperCase()}</div>
        <div>Date: ${new Date().toLocaleDateString()}</div>
      </div>

      <div class="details">
        <div class="detail-row">
          <span>Customer Name:</span>
          <span>${customerName}</span>
        </div>
        <div class="detail-row">
          <span>Email:</span>
          <span>${customerEmail}</span>
        </div>
        ${productTitle ? `
        <div class="detail-row">
          <span>${itemLabel}:</span>
          <span>${productTitle}</span>
        </div>
        ` : ''}
        <div class="detail-row total">
          <span>Total Amount:</span>
          <span>$${(amount / 100).toFixed(2)}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for your purchase!</p>
        <p>Visit rayarmillion.com for more music and events</p>
      </div>
    </body>
    </html>
  `;
}