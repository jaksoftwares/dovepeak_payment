'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { formatPhone, isValidPhone } from '@/lib/utils';

export default function PaymentForm() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!isValidPhone(phone)) {
      setError('Please enter a valid M-Pesa phone number (e.g. 0712345678)');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formatPhone(phone),
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[#0B1E3F]">STK Push Sent!</h2>
        <p className="text-gray-600">Please check your phone and enter your M-Pesa PIN to complete the payment.</p>
        <Button variant="outline" onClick={() => setSuccess(false)} className="mt-4">
          Try Again / Back
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-[#0B1E3F]">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0F9D58] focus:outline-none transition-colors"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-semibold text-[#0B1E3F]">
          Amount (KES)
        </label>
        <input
          id="amount"
          type="number"
          placeholder="500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0F9D58] focus:outline-none transition-colors"
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <Button type="submit" className="w-full" loading={loading}>
        Pay via M-Pesa
      </Button>

      <div className="flex flex-col items-center gap-2 pt-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span>🔒 Secure Payment</span>
          <span className="w-px h-3 bg-gray-300"></span>
          <span>Powered by Safaricom M-Pesa</span>
        </div>
      </div>
    </form>
  );
}
