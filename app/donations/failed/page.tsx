'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

export default function DonationFailedPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border border-red-50">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Donation Unsuccessful</h1>
        <p className="text-gray-600 mb-8">
          We couldn't process your donation at this time. This could be due to a cancelled prompt or insufficient funds.
        </p>

        <div className="space-y-4">
          <Link href="/donations" className="block w-full">
            <Button className="w-full py-4 bg-[#472CE3]">
              Try Again
            </Button>
          </Link>
          
          <Link href="/" className="block w-full text-sm text-gray-500 hover:text-[#472CE3] transition-colors">
            Return to Home
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            If you continue to experience issues, please contact our support.
          </p>
        </div>
      </div>
    </main>
  );
}
