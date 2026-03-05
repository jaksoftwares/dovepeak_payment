'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface DonationDetails {
  reference?: string;
  amount?: string;
  phone?: string;
  mpesa_receipt?: string;
  updated_at?: string;
  status?: string;
}

function DonationSuccessContent() {
  const searchParams = useSearchParams();
  const [animate, setAnimate] = useState(false);
  const [details, setDetails] = useState<DonationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  const reference = searchParams.get('ref') || 'N/A';
  const amount = searchParams.get('amount') || 'N/A';
  const checkoutId = searchParams.get('checkoutId');

  useEffect(() => {
    setTimeout(() => setAnimate(true), 100);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!checkoutId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/check-status?checkoutRequestId=${checkoutId}`);
        const data = await response.json();
        
        if (data.status === 'completed') {
          setDetails({
            reference: data.reference,
            amount: data.amount,
            phone: data.phone,
            mpesa_receipt: data.mpesa_receipt,
            updated_at: data.updated_at,
            status: data.status
          });
        }
      } catch (err) {
        console.error('Error fetching donation details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [checkoutId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return new Date().toLocaleString('en-KE');
    const date = new Date(dateString);
    return date.toLocaleString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return 'N/A';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  };

  const displayAmount = details?.amount || amount;
  const displayReceipt = details?.mpesa_receipt || 'Processing...';
  const displayPhone = details?.phone || 'N/A';
  const displayDate = details?.updated_at ? formatDate(details.updated_at) : formatDate();

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className={`w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 text-center transform transition-all duration-700 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Donation Success Header */}
        <div className={`relative w-24 h-24 mx-auto mb-6 transform transition-all duration-500 ${animate ? 'scale-100' : 'scale-0'}`}>
          <div className="absolute top-0 left-0 w-full h-full bg-purple-100 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-12 h-12 text-[#472CE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-purple-400 animate-ping opacity-20"></div>
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-[#27187D] mb-1">Thank You! 🎉</h1>
        <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-4">Donation Successful</h2>
        
        <div className="bg-purple-50 rounded-xl p-4 mb-6 border border-purple-100 italic">
          <p className="text-sm sm:text-base text-purple-800 font-medium">
            "Your contribution of <span className="font-bold">KES {Number(displayAmount).toLocaleString()}</span> makes a real difference. We are truly grateful for your support."
          </p>
        </div>

        {/* Donation Receipt Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 text-left">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Donation Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Amount</span>
              <span className="text-[#27187D] font-bold text-lg">KES {Number(displayAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">To Account</span>
              <span className="text-[#27187D] font-semibold text-sm">Joseph Amuyunzu Kirika</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="text-[#27187D] font-mono font-semibold text-sm">{reference}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">M-Pesa Receipt</span>
              <span className="text-[#27187D] font-mono font-semibold text-sm">{displayReceipt}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Date</span>
              <span className="text-[#27187D] font-semibold text-sm">{displayDate}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/donations"
            className="block w-full bg-[#472CE3] text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-[#3216B0] transition-all shadow-lg text-sm sm:text-base"
          >
            Back to Donations
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="w-full bg-white text-gray-600 font-medium py-2.5 sm:py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Acknowledgment
          </button>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-100">
          <p className="text-[10px] text-gray-400">
            Dovepeak Digital Solutions • Secure Payment Processing
          </p>
        </div>
      </div>
    </main>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <DonationSuccessContent />
    </Suspense>
  );
}
