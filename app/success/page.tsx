'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaymentDetails {
  ref?: string;
  amount?: string;
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [animate, setAnimate] = useState(false);
  
  const reference = searchParams.get('ref') || 'N/A';
  const amount = searchParams.get('amount') || 'N/A';

  useEffect(() => {
    // Trigger animations on mount
    setTimeout(() => setAnimate(true), 100);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#27187D] via-[#472CE3] to-[#6B4EE6] flex items-center justify-center p-4">
      <div className={`w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Animated Success Icon */}
        <div className={`relative w-24 h-24 mx-auto mb-6 transform transition-all duration-500 ${animate ? 'scale-100' : 'scale-0'}`}>
          <div className="absolute top-0 left-0 w-full h-full bg-green-100 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-12 h-12 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        
        {/* Thank You Message */}
        <h1 className="text-3xl font-bold text-[#27187D] mb-2">
          Thank You! 🎉
        </h1>
        <h2 className="text-xl font-semibold text-[#0F9D58] mb-6">
          Payment Successful
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your payment has been received and processed successfully. A confirmation message has been sent to your phone.
        </p>

        {/* Receipt Details */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Amount Paid</span>
              <span className="text-[#27187D] font-bold text-lg">KES {Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="text-[#27187D] font-mono font-semibold">{reference}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="text-[#0F9D58] font-bold text-sm bg-green-50 px-3 py-1 rounded-full uppercase">
                ✓ Completed
              </span>
            </div>
          </div>
        </div>

        {/* M-Pesa Confirmation Note */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <p className="text-sm text-blue-700">
            📱 You will receive an M-Pesa confirmation SMS shortly
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-[#27187D] text-white font-semibold py-4 rounded-xl hover:bg-[#472CE3] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Make Another Payment
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Receipt
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Powered by Safaricom M-Pesa • DovePeak Digital
          </p>
        </div>
      </div>
    </main>
  );
}
