import React from 'react';
import Link from 'next/link';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`mt-6 text-center flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-center gap-4 text-sm text-[#27187D] font-medium">
        <Link href="/privacy" className="hover:text-[#472CE3] transition-colors">
          Privacy Policy
        </Link>
        <span className="text-gray-300">•</span>
        <Link href="/terms" className="hover:text-[#472CE3] transition-colors">
          Terms of Service
        </Link>
      </div>
      <p className="text-xs text-gray-400">
        &copy; {currentYear} Dovepeak Digital Solutions. All rights reserved.
      </p>
    </div>
  );
}
