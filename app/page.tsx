import Image from 'next/image';
import PaymentForm from '@/components/PaymentForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header/Banner */}
        <div className="bg-[#27187D] p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 overflow-hidden shadow-inner">
            <Image 
              src="/logo.png" 
              alt="Dovepeak Logo" 
              width={80} 
              height={80} 
              className="object-contain p-2"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Dovepeak Digital Solutions</h1>
          <p className="text-gray-300 text-sm">Secure M-Pesa Payment Portal</p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-8 pb-8 sm:pb-10">
          <PaymentForm />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Dovepeak Digital Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  );
}
