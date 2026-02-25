'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from './Button';
import { formatPhone, isValidPhone } from '@/lib/utils';

type PaymentState = 'idle' | 'sending' | 'waiting' | 'success' | 'failed';

// Maximum time to wait for payment (in milliseconds)
const PAYMENT_TIMEOUT = 120000; // 2 minutes
const POLLING_INTERVAL = 3000; // 3 seconds

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [waitingTime, setWaitingTime] = useState(0);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle successful payment redirect - useEffect to avoid setState during render
  useEffect(() => {
    if (state === 'success' && reference && amount && checkoutRequestId) {
      router.push(`/success?ref=${reference}&amount=${amount}&checkoutId=${checkoutRequestId}`);
    }
  }, [state, reference, amount, checkoutRequestId, router]);

  const checkPaymentStatus = async (checkoutId: string) => {
    try {
      const response = await fetch(`/api/check-status?checkoutRequestId=${checkoutId}`);
      const data = await response.json();

      if (data.status === 'completed') {
        // Payment completed successfully
        stopPolling();
        setState('success');
      } else if (data.status === 'failed') {
        // Payment failed
        stopPolling();
        setError('Payment was declined. Please try again.');
        setState('failed');
      }
      // If 'pending', continue polling
    } catch (err) {
      console.error('Error checking payment status:', err);
    }
  };

  const startPolling = useCallback((checkoutId: string) => {
    // Start the polling interval
    pollingRef.current = setInterval(() => {
      checkPaymentStatus(checkoutId);
    }, POLLING_INTERVAL);

    // Start the timeout timer
    const startTime = Date.now();
    const updateWaitingTime = () => {
      if (pollingRef.current) {
        setWaitingTime(Math.floor((Date.now() - startTime) / 1000));
        
        // Check if we've exceeded the timeout
        if (Date.now() - startTime >= PAYMENT_TIMEOUT) {
          stopPolling();
          setError('Payment request timed out. Please try again.');
          setState('failed');
        } else {
          // Continue updating the waiting time
          timeoutRef.current = setTimeout(updateWaitingTime, 1000);
        }
      }
    };
    
    timeoutRef.current = setTimeout(updateWaitingTime, 1000);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

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
        setWaitingTime(0);
        setState('waiting');
        setStatusMessage('Waiting for payment confirmation...');
        
        // Start polling for payment status
        if (data.checkoutRequestId) {
          startPolling(data.checkoutRequestId);
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
    stopPolling();
    setState('idle');
    setPhone('');
    setAmount('');
    setReference('');
    setCheckoutRequestId('');
    setError('');
    setStatusMessage('');
    setWaitingTime(0);
  };

  // Loading/Sending State
  if (state === 'sending') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <SendingLoader />
        <h2 className="text-lg sm:text-xl font-bold text-[#27187D] mt-4 sm:mt-6">Processing Payment</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{statusMessage}</p>
        <div className="mt-4 sm:mt-6 bg-gray-50 rounded-xl p-3 sm:p-4">
          <p className="text-sm text-gray-500">Amount: <span className="font-bold text-[#27187D]">KES {Number(amount).toLocaleString()}</span></p>
        </div>
      </div>
    );
  }

  // Waiting for Payment State
  if (state === 'waiting') {
    const remainingTime = Math.max(0, Math.ceil((PAYMENT_TIMEOUT / 1000 - waitingTime) / 60));
    const progress = Math.min(100, (waitingTime / (PAYMENT_TIMEOUT / 1000)) * 100);
    
    return (
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <WaitingLoader />
        <h2 className="text-lg sm:text-xl font-bold text-[#27187D] mt-4 sm:mt-6">Check Your Phone!</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          We've sent an M-Pesa prompt to <span className="font-semibold">{phone}</span>
        </p>
        <div className="mt-4 sm:mt-6 bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100">
          <p className="text-sm text-blue-700">
            📱 Enter your M-Pesa PIN on your phone to complete payment
          </p>
        </div>
        
        {/* Waiting Timer */}
        <div className="mt-4 sm:mt-6 space-y-2">
          <div className="flex justify-between text-xs sm:text-sm text-gray-500">
            <span>Waiting: {waitingTime}s</span>
            <span>Timeout: {remainingTime} min</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400">
          <p>Reference: {reference}</p>
        </div>
        <Button 
          variant="outline" 
          onClick={resetForm}
          className="mt-4 sm:mt-6"
        >
          Cancel
        </Button>
      </div>
    );
  }

  // Success State - will redirect to success page (via useEffect)
  if (state === 'success') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <SendingLoader />
        <h2 className="text-lg sm:text-xl font-bold text-green-600 mt-4 sm:mt-6">Payment Successful!</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Redirecting to confirmation page...</p>
      </div>
    );
  }

  // Failed State
  if (state === 'failed') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-red-600 mt-3 sm:mt-4">Payment Failed</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{error}</p>
        <Button 
          variant="outline" 
          onClick={resetForm}
          className="mt-4 sm:mt-6"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Idle State - Payment Form
  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full max-w-md">
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
          className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
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
          className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <Button type="submit" className="w-full py-3 sm:py-4">
        Pay via M-Pesa
      </Button>

      <div className="flex flex-col items-center gap-2 pt-3 sm:pt-4">
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
    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#472CE3]/20 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-[#472CE3] border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#472CE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
  );
}

// Waiting Loader Component
function WaitingLoader() {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto">
      <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      </div>
      {/* Pulsing rings */}
      <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-400 animate-ping opacity-20"></div>
    </div>
  );
}
