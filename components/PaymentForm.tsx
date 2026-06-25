'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from './Button';
import { formatPhone, isValidPhone } from '@/lib/utils';

type PaymentState = 'idle' | 'sending' | 'waiting' | 'success' | 'failed';

// Maximum time to wait for payment (in milliseconds)
const PAYMENT_TIMEOUT = 120000; // 2 minutes
const POLLING_INTERVAL = 3000; // 3 seconds

export default function PaymentForm() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [consent, setConsent] = useState(false);

  const [state, setState] = useState<PaymentState>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const router = useRouter();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        setError('The payment could not be completed. Please try again.');
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
    const checkTimeout = () => {
      if (pollingRef.current) {
        // Check if we've exceeded the timeout
        if (Date.now() - startTime >= PAYMENT_TIMEOUT) {
          stopPolling();
          setError('The payment request expired. Please try again.');
          setState('failed');
        } else {
          // Continue checking the timeout
          timeoutRef.current = setTimeout(checkTimeout, 1000);
        }
      }
    };
    
    timeoutRef.current = setTimeout(checkTimeout, 1000);

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
    
    if (!fullName.trim()) {
      setError('Enter your full name.');
      return;
    }

    if (!isValidPhone(phone)) {
      setError('Enter a valid Safaricom phone number.');
      return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a valid amount.');
      return;
    }

    if (!consent) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    // Purpose is optional, but if provided, validate length
    let sanitizedPurpose = purpose.trim();
    if (sanitizedPurpose.length > 255) {
      setError('Purpose of payment must not exceed 255 characters.');
      return;
    }

    setState('sending');
    setStatusMessage('Submitting payment request...');

    try {
      const response = await fetch('/api/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formatPhone(phone),
          amount: Number(amount),
          fullName: fullName.trim(),
          purposeOfPayment: sanitizedPurpose || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // STK push sent successfully
        setReference(data.reference);
        setCheckoutRequestId(data.checkoutRequestId);
        setState('waiting');

        setStatusMessage('Awaiting payment confirmation...');
        
        // Start polling for payment status
        if (data.checkoutRequestId) {
          startPolling(data.checkoutRequestId);
        }
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
        setState('failed');
      }
    } catch {
      setError('Unable to connect. Please try again.');
      setState('failed');
    }
  };

  const resetForm = () => {
    stopPolling();
    setState('idle');
    setPhone('');
    setAmount('');
    setFullName('');
    setPurpose('');
    setConsent(false);
    setReference('');
    setCheckoutRequestId('');
    setError('');
    setStatusMessage('');
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
    return (
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <WaitingLoader />
        <h2 className="text-lg sm:text-xl font-bold text-[#27187D] mt-4 sm:mt-6">Authorize Payment</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          An M-Pesa authorization request has been sent to <span className="font-semibold text-[#472CE3]">{phone}</span>
        </p>

        {/* Professional Status Steps */}
        <div className="mt-8 space-y-4 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Request Submitted</p>
              <p className="text-xs text-gray-500">Your payment request has been submitted.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center relative">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Awaiting Approval</p>
              <p className="text-xs text-gray-500">Approve the request on your phone.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 opacity-40">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Processing Payment</p>
              <p className="text-xs text-gray-500">Finalizing your transaction.</p>
            </div>
          </div>

        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100/50 flex items-center gap-3">
          <p className="text-xs text-blue-700 text-left leading-relaxed">
            Keep this page open while your payment is being processed.
          </p>
        </div>

        
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="text-xs text-gray-400 font-mono">Ref: {reference}</div>
          <button 
            onClick={resetForm}
            className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
          >
            Cancel Payment
          </button>
        </div>
      </div>
    );
  }

  // Success State - will redirect to success page (via useEffect)
  if (state === 'success') {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 text-center">
        <SendingLoader />
        <h2 className="text-lg sm:text-xl font-bold text-green-600 mt-4 sm:mt-6">Payment Successful</h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">Redirecting to your receipt...</p>
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
        <h2 className="text-lg sm:text-xl font-bold text-red-600 mt-3 sm:mt-4">Payment Unsuccessful</h2>
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
    <form suppressHydrationWarning onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full max-w-md">

      <div className="space-y-2">
        <label htmlFor="fullName" className="block text-sm font-semibold text-[#27187D]">
          Full Name
        </label>
        <input
          suppressHydrationWarning
          id="fullName"
          type="text"
          placeholder="John Kamau"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-2">

        <label htmlFor="phone" className="block text-sm font-semibold text-[#27187D]">
          Phone Number
        </label>
        <input
          suppressHydrationWarning
          id="phone"
          type="tel"
          placeholder="0712345678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">Enter the Safaricom number that will authorize this payment.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="purpose" className="block text-sm font-semibold text-[#27187D]">
          Purpose of Payment
        </label>
        <input
          suppressHydrationWarning
          id="purpose"
          type="text"
          placeholder="Website Hosting Subscription"
          maxLength={255}
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-500 mt-1">Describe what this payment is for.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-semibold text-[#27187D]">
          Amount (KES)
        </label>
        <input
          suppressHydrationWarning
          id="amount"
          type="number"
          placeholder="50000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input 
          type="checkbox" 
          id="consent" 
          checked={consent} 
          onChange={(e) => setConsent(e.target.checked)} 
          className="mt-0.5 w-4 h-4 text-[#27187D] rounded border-gray-300 focus:ring-[#472CE3]" 
        />
        <label htmlFor="consent" className="text-xs text-gray-600 leading-tight">
          I have read and agree to the{' '}
          <Link href="/terms" className="text-[#27187D] hover:underline" target="_blank">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-[#27187D] hover:underline" target="_blank">
            Privacy Policy
          </Link>.
        </label>
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      <Button type="submit" className="w-full py-3 sm:py-4">
        Pay with M-Pesa
      </Button>

      <div className="flex flex-col items-center gap-2 pt-3 sm:pt-4">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span>Secure Payment</span>
          <span className="w-px h-3 bg-gray-300"></span>
          <span>Powered by M-Pesa</span>
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
