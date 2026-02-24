import React from 'react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#0F9D58]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-[#0B1E3F] mb-3">Payment Successful</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your payment has been received and processed successfully. A confirmation message has been sent to your phone.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Receipt Info</p>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500 text-sm">Status</span>
            <span className="text-[#0F9D58] font-bold text-sm bg-green-50 px-3 py-1 rounded-full uppercase">Success</span>
          </div>
        </div>

        <Link 
          href="/"
          className="inline-block w-full bg-[#0B1E3F] text-white font-semibold py-4 rounded-xl hover:bg-[#162d5a] transition-colors shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
