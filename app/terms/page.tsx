import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Terms of Service | Dovepeak Payments',
  description: 'Terms of Service for Dovepeak Payments, a secure payment gateway by Dovepeak Digital Solutions.',
};

export default function TermsOfService() {
  const lastUpdated = "June 26, 2026";

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Navbar / Header area */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#27187D] rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
             <Image 
                src="/logo.png" 
                alt="Dovepeak Logo" 
                width={24} 
                height={24} 
                className="object-contain"
              />
          </div>
          <span className="font-bold text-[#27187D] text-lg hidden sm:block">Dovepeak Payments</span>
        </Link>
        <Link 
          href="/" 
          className="text-sm font-semibold text-[#27187D] hover:text-[#472CE3] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 print:shadow-none print:border-none print:rounded-none">
        
        {/* Header section */}
        <div className="bg-[#27187D] p-8 sm:p-12 text-center text-white print:bg-white print:text-black">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-300 print:text-gray-600 text-sm sm:text-base">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content section */}
        <div className="p-8 sm:p-12 prose prose-sm sm:prose-base prose-blue max-w-none text-gray-700">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Dovepeak Payments platform ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the Service. Dovepeak Payments is developed and operated by Dovepeak Digital Solutions ("we," "our," or "us").
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and capable of forming a binding contract to use this Service. By using the Service, you represent and warrant that you meet these eligibility requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">3. User Responsibilities</h2>
            <p className="mb-4">As a user initiating payments through the Service, you agree to:</p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information, including a valid phone number.</li>
              <li>Only use payment methods (e.g., M-Pesa accounts) that you are authorized to use.</li>
              <li>Keep your device and PIN secure to prevent unauthorized transactions.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">4. Merchant Responsibilities</h2>
            <p>
              Dovepeak Payments acts strictly as a payment processor. We do not sell, guarantee, or take responsibility for the goods, services, or content provided by the merchants or applications utilizing our payment gateway. Merchants are solely responsible for product delivery, customer service, and resolving disputes related to the underlying transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">5. Payment Processing & Authorization</h2>
            <p className="mb-4">
              When you submit a payment request, you authorize us to transmit the request to the relevant third-party payment provider (e.g., Safaricom M-Pesa).
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>The transaction is subject to the terms and conditions of the third-party provider.</li>
              <li>You must authorize the prompt on your device using your secure PIN to complete the transaction.</li>
              <li>A transaction is only considered successful once confirmed by the third-party provider.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">6. Fees</h2>
            <p>
              Dovepeak Payments may apply transaction fees depending on the merchant agreement. Any applicable fees charged directly to the user by Dovepeak Payments will be clearly communicated before you authorize the transaction. Standard network or provider fees (e.g., M-Pesa transaction fees) may also apply and are determined by your service provider.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">7. Refunds and Disputes</h2>
            <p>
              Because Dovepeak Payments is a payment processor, refund policies are determined by the respective merchant from whom you purchased goods or services. Requests for refunds, cancellations, or disputes must be directed to the merchant. We will assist in providing transaction records to facilitate dispute resolution if required.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">8. Prohibited Use</h2>
            <p className="mb-4">You may not use the Service for any unlawful or prohibited activities, including but not limited to:</p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Fraudulent transactions or money laundering.</li>
              <li>Purchasing illegal goods or services.</li>
              <li>Attempting to bypass security measures or disrupt the platform's infrastructure.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">9. Intellectual Property</h2>
            <p>
              All content, trademarks, logos, and software associated with the Dovepeak Payments platform are the property of Dovepeak Digital Solutions or its licensors. You are granted no rights or licenses to use these intellectual property assets without prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">10. Service Availability</h2>
            <p>
              We strive to ensure high availability of the Service. However, access may be occasionally restricted for maintenance, updates, or due to factors outside our control (such as third-party provider outages). We are not liable for any delays or failures in transaction processing caused by such interruptions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">11. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Dovepeak Digital Solutions shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, arising out of your use or inability to use the Service. Our total liability for any claim arising from these terms shall not exceed the amount you paid us to use the Service in the past 12 months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">12. Suspension or Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to the Service at any time, without notice, if we suspect you have violated these Terms of Service, engaged in fraudulent activity, or if required by law enforcement or regulatory authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">13. Governing Law</h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws of Kenya. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Kenya.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">14. Changes to the Terms</h2>
            <p>
              We may modify these Terms of Service at any time. We will indicate the date of the most recent update at the top of this page. Your continued use of the Service following any modifications constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">15. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 inline-block">
              <a href="mailto:support@dovepeakdigital.com" className="font-semibold text-[#472CE3] hover:underline">
                support@dovepeakdigital.com
              </a>
            </div>
          </section>
        </div>
      </div>
      
      <div className="mt-8 w-full max-w-4xl print:hidden">
        <Footer />
      </div>
    </main>
  );
}
