import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | Dovepeak Payments',
  description: 'Privacy Policy for Dovepeak Payments, a secure payment gateway by Dovepeak Digital Solutions.',
};

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-300 print:text-gray-600 text-sm sm:text-base">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content section */}
        <div className="p-8 sm:p-12 prose prose-sm sm:prose-base prose-blue max-w-none text-gray-700">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">1. Introduction</h2>
            <p className="mb-4">
              Welcome to Dovepeak Payments, a secure payment gateway developed and operated by Dovepeak Digital Solutions ("we," "our," or "us"). We respect your privacy and are committed to protecting the personal information you share with us.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our payment gateway services to process transactions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">2. Information We Collect</h2>
            <p className="mb-4">
              To facilitate secure payments, we collect necessary information from you during the transaction process. This includes:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Contact Information:</strong> Your full name and phone number.</li>
              <li><strong>Transaction Details:</strong> Payment amount, payment purpose, transaction reference numbers, and timestamps.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, and interaction data generated while using our platform.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">3. How We Use Your Information</h2>
            <p className="mb-4">
              We use the collected information solely to provide and improve our services. Specifically, we use your data to:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Process and authorize your payments via supported providers (e.g., Safaricom M-Pesa).</li>
              <li>Send transaction confirmations, receipts, and status updates.</li>
              <li>Prevent, detect, and investigate fraudulent or unauthorized activities.</li>
              <li>Maintain and improve the security, performance, and reliability of our platform.</li>
              <li>Comply with applicable legal and regulatory requirements.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">4. Payment Information</h2>
            <p>
              We process payments securely via third-party providers such as Safaricom M-Pesa. We do not directly collect, store, or manage your underlying bank account details or M-Pesa PINs. All payment authorizations occur securely on your device or via the third-party provider's network.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">5. Third-Party Services</h2>
            <p className="mb-4">
              We may share your information with trusted third parties exclusively for the purpose of facilitating the payment process. These include:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li><strong>Payment Processors:</strong> Such as Safaricom to execute the transaction.</li>
              <li><strong>Merchants:</strong> The business or application to which you are making a payment receives confirmation of your payment and relevant details to fulfill your order.</li>
              <li><strong>Service Providers:</strong> Cloud hosting and security infrastructure partners that support our platform.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">6. Security Measures</h2>
            <p>
              We implement industry-standard administrative, technical, and physical security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">7. Data Retention</h2>
            <p>
              We retain your personal information and transaction records only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, resolve disputes, and comply with our legal and regulatory obligations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">8. Cookies and Tracking</h2>
            <p>
              Our platform uses essential cookies and similar technologies necessary for the core functionality of the payment gateway, such as session management and security. We do not use intrusive tracking cookies for behavioral advertising.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">9. User Rights</h2>
            <p className="mb-4">
              Depending on your jurisdiction, you may have rights regarding your personal data, including the right to:
            </p>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request the correction of inaccurate or incomplete data.</li>
              <li>Request the deletion of your data, subject to legal and regulatory constraints.</li>
            </ul>
            <p>To exercise these rights, please contact us using the details provided below.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">10. Children's Privacy</h2>
            <p>
              Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have inadvertently gathered such data, we will take reasonable measures to delete it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">11. Policy Updates</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The "Last Updated" date at the top of this page will indicate when changes were made.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-[#27187D] mb-4">12. Contact Information</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
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
