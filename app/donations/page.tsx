import Image from 'next/image';
import DonationForm from '@/components/DonationForm';

export const metadata = {
  title: 'Make a Donation - Dovepeak Digital Solutions',
  description: 'Support Dovepeak Digital Solutions through our secure M-Pesa donation portal.',
};

export default function DonationsPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header/Banner with a warmer donation theme (Purple/Indigo) */}
        <div className="bg-[#472CE3] p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-xl"></div>
          
          <div className="relative z-10">
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
            <p className="text-purple-100 text-sm">Secure M-Pesa Donation Portal</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-gray-800">Support Our Work</h2>
            <p className="text-sm text-gray-500 mt-1">Your contribution helps us continue providing quality digital solutions.</p>
          </div>
          
          <DonationForm />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Dovepeak Digital Solutions. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <span className="text-[10px] text-gray-400">Secure</span>
            <span className="text-[10px] text-gray-400">Transparent</span>
            <span className="text-[10px] text-gray-400">Impactful</span>
          </div>
        </div>
      </div>
    </main>
  );
}
