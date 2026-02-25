'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaymentDetails {
  reference?: string;
  amount?: string;
  phone?: string;
  mpesa_receipt?: string;
  updated_at?: string;
  status?: string;
}

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [animate, setAnimate] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const reference = searchParams.get('ref') || 'N/A';
  const amount = searchParams.get('amount') || 'N/A';
  const checkoutId = searchParams.get('checkoutId');

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setAnimate(true), 100);
  }, []);

  // Fetch full payment details from the database
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!checkoutId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/check-status?checkoutRequestId=${checkoutId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setPaymentDetails({
            reference: data.reference,
            amount: data.amount,
            phone: data.phone,
            mpesa_receipt: data.mpesa_receipt,
            updated_at: data.updated_at,
            status: data.status
          });
        }
      } catch (err) {
        console.error('Error fetching payment details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [checkoutId]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format phone number for display
  const formatPhone = (phone?: string) => {
    if (!phone) return 'N/A';
    // Format as 07XX XXX XXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  const displayAmount = paymentDetails?.amount || amount;
  const displayReceipt = paymentDetails?.mpesa_receipt || 'Processing...';
  const displayPhone = paymentDetails?.phone || 'N/A';
  const displayDate = paymentDetails?.updated_at ? formatDate(paymentDetails.updated_at) : formatDate();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className={`w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 text-center transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Animated Success Icon */}
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 transform transition-all duration-500 ${animate ? 'scale-100' : 'scale-0'}`}>
          <div className="absolute top-0 left-0 w-full h-full bg-green-100 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                d="M5 13l4 4L19 7"
                className={`transition-all duration-700 ${animate ? 'opacity-100' : 'opacity-0'}`}
              ></path>
            </svg>
          </div>
          {/* Success rings */}
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-green-400 animate-ping opacity-30"></div>
        </div>
        
        {/* Enhanced Thank You Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[#27187D] mb-1 sm:mb-2">
          Thank You! 🎉
        </h1>
        <h2 className="text-lg sm:text-xl font-semibold text-[#0F9D58] mb-3 sm:mb-4">
          Payment Successful
        </h2>
        
        {/* Confirmation Message */}
        <div className="bg-green-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-green-100">
          <p className="text-sm sm:text-base text-green-800 font-medium">
            ✓ Confirmed payment of <span className="font-bold">KES {Number(displayAmount).toLocaleString()}</span> to <span className="font-bold">Dovepeak Digital Solutions</span>
          </p>
        </div>

        <p className="text-gray-600 mb-5 sm:mb-8 text-sm sm:text-base leading-relaxed">
          Your payment has been received and processed successfully. A confirmation message has been sent to your phone.
        </p>

        {/* Receipt Details */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 mb-5 sm:mb-8 border border-gray-200">
          {/* Receipt Header */}
          <div className="flex items-center justify-center mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-gray-200">
            <div className="bg-[#27187D] p-2 rounded-lg mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-base sm:text-lg font-bold text-[#27187D]">Payment Receipt</h3>
              <p className="text-xs text-gray-500">Dovepeak Digital Solutions</p>
            </div>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="text-[#27187D] font-bold text-base sm:text-lg">KES {Number(displayAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Account</span>
              <span className="text-[#27187D] font-semibold text-sm">Joseph Amuyunzu Kirika</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">M-Pesa Receipt</span>
              <span className="text-[#27187D] font-mono font-semibold text-sm">{displayReceipt}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="text-[#27187D] font-mono font-semibold text-sm">{reference}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Phone Number</span>
              <span className="text-[#27187D] font-semibold text-sm">{formatPhone(displayPhone)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Date & Time</span>
              <span className="text-[#27187D] font-semibold text-xs sm:text-sm">{displayDate}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="text-[#0F9D58] font-bold text-xs sm:text-sm bg-green-50 px-2 sm:px-3 py-1 rounded-full uppercase">
                ✓ Completed
              </span>
            </div>
          </div>
        </div>

        {/* M-Pesa Confirmation Note */}
        <div className="bg-blue-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-100">
          <p className="text-sm text-blue-700">
            📱 You will receive an M-Pesa confirmation SMS shortly
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-[#27187D] text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-[#472CE3] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            Make Another Payment
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="w-full bg-gray-100 text-gray-700 font-medium py-2.5 sm:py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Receipt
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Powered by Safaricom M-Pesa • DovePeak Digital
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 text-center">
          <div className="animate-pulse">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gray-200 rounded-full"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </main>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
