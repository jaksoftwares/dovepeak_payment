import React from 'react';
import PaymentForm from '@/components/PaymentForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header/Banner */}
        <div className="bg-[#0B1E3F] p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
            {/* Placeholder Logo */}
            <svg className="w-10 h-10 text-[#0F9D58]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Dovepeak Digital Solutions</h1>
          <p className="text-gray-300 text-sm">Secure M-Pesa Payment Portal</p>
        </div>

        {/* Form Container */}
        <div className="p-8 pb-10">
          <PaymentForm />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Dovepeak Digital Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
