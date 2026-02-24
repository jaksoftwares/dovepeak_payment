import React from 'react';
import Link from 'next/link';

export default function FailedPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-[#27187D] mb-3">Payment Failed</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We couldn't process your payment. This could be due to insufficient funds, a cancelled request, or a technical issue.
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block w-full bg-[#27187D] text-white font-semibold py-4 rounded-xl hover:bg-[#472CE3] transition-colors shadow-lg"
          >
            Retry Payment
          </Link>
          <Link 
            href="/"
            className="inline-block w-full border-2 border-[#27187D] text-[#27187D] font-semibold py-4 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </main>
  );
}
