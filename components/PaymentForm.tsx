'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { formatPhone, isValidPhone } from '@/lib/utils';

type PaymentState = 'idle' | 'sending' | 'waiting' | 'success' | 'failed';

export default function PaymentForm() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [state, setState] = useState<PaymentState>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const checkPaymentStatus = async (checkoutId: string) => {
    try {
      const response = await fetch(`/api/check-status?checkoutRequestId=${checkoutId}`);
      const data = await response.json();

      if (data.status === 'completed') {
        // Payment completed successfully
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        setState('success');
      } else if (data.status === 'failed') {
        // Payment failed
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
        setError('Payment was declined. Please try again.');
        setState('failed');
      }
      // If 'pending', continue polling
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

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

    setState('sending');
    setStatusMessage('Sending payment request...');

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
        // STK push sent successfully
        setReference(data.reference);
        setCheckoutRequestId(data.checkoutRequestId);
        setState('waiting');
        setStatusMessage('Waiting for payment confirmation...');
        
        // Start polling for payment status
        if (data.checkoutRequestId) {
          pollingRef.current = setInterval(() => {
            checkPaymentStatus(data.checkoutRequestId);
          }, 3000); // Check every 3 seconds
        }
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
        setState('failed');
      }
    } catch {
      setError('Failed to connect to the server. Please try again.');
      setState('failed');
    }
  };

  const resetForm = () => {
    setState('idle');
    setPhone('');
    setAmount('');
    setReference('');
    setCheckoutRequestId('');
    setError('');
    setStatusMessage('');
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  // Loading/Sending State
  if (state === 'sending') {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <SendingLoader />
        <h2 className="text-xl font-bold text-[#27187D] mt-6">Processing Payment</h2>
        <p className="text-gray-600 mt-2">{statusMessage}</p>
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">Amount: <span className="font-bold text-[#27187D]">KES {Number(amount).toLocaleString()}</span></p>
        </div>
      </div>
    );
  }

  // Waiting for Payment State
  if (state === 'waiting') {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <WaitingLoader />
        <h2 className="text-xl font-bold text-[#27187D] mt-6">Check Your Phone!</h2>
        <p className="text-gray-600 mt-2">
          We've sent an M-Pesa prompt to <span className="font-semibold">{phone}</span>
        </p>
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-700">
            📱 Enter your M-Pesa PIN on your phone to complete payment
          </p>
        </div>
        <div className="mt-4 text-xs text-gray-400">
          <p>Reference: {reference}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={resetForm}
          className="mt-6"
        >
          Cancel
        </Button>
      </div>
    );
  }

  // Success State - will redirect to success page
  if (state === 'success') {
    router.push(`/success?ref=${reference}&amount=${amount}`);
    return null;
  }

  // Failed State
  if (state === 'failed') {
    return (
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-600 mt-4">Payment Failed</h2>
        <p className="text-gray-600 mt-2">{error}</p>
        <Button 
          variant="outline" 
          onClick={resetForm}
          className="mt-6"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Idle State - Payment Form
  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-[#27187D]">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="07XXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-semibold text-[#27187D]">
          Amount (KES)
        </label>
        <input
          id="amount"
          type="number"
          placeholder="500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <Button type="submit" className="w-full">
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

// Sending Loader Component
function SendingLoader() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#472CE3]/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#472CE3] border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="w-8 h-8 text-[#472CE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
  );
}

// Waiting Loader Component
function WaitingLoader() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      </div>
      {/* Pulsing rings */}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-400 animate-ping opacity-20"></div>
    </div>
  );
}
