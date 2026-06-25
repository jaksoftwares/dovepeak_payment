'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Footer from '@/components/Footer';

export default function AdminSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!consent) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    try {
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      if (data.user) {
        setSuccess('Registration successful! Redirecting to dashboard...');
        // The user is automatically logged in after signup if email confirmation is disabled
        setTimeout(() => {
          router.push('/admin');
          router.refresh();
        }, 1500);
      }
    } catch {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#27187D] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#27187D] mb-2">Registration Disabled</h1>
          <p className="text-gray-500 text-sm">Dovepeak Digital Solutions</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-4 rounded-xl mb-6 text-sm text-center leading-relaxed">
          Admin registration is currently disabled for security purposes. If you need an account, please contact the system administrator.
        </div>

        {/* --- REGISTRATION FORM (COMMENTED OUT FOR SECURITY) ---
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[#27187D]">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@dovepeak.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-[#27187D]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#27187D] transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#27187D]">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-base border-2 border-gray-100 rounded-xl focus:border-[#472CE3] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input 
              type="checkbox" 
              id="consent" 
              checked={consent} 
              onChange={(e) => setConsent(e.target.checked)} 
              className="mt-0.5 w-4 h-4 text-[#27187D] rounded border-gray-300 focus:ring-[#472CE3]" 
            />
            <label htmlFor="consent" className="text-xs text-gray-600 leading-tight">
              I have read and agree to the{' '}
              <Link href="/terms" className="text-[#27187D] hover:underline" target="_blank">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-[#27187D] hover:underline" target="_blank">
                Privacy Policy
              </Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#27187D] text-white font-semibold py-3 sm:py-4 rounded-xl hover:bg-[#472CE3] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        ------------------------------------------------------------- */}

        <div className="mt-6 sm:mt-8 text-center flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <a href="/admin/login" className="text-[#27187D] font-semibold hover:text-[#472CE3]">
              Login
            </a>
          </p>
          <a
            href="/"
            className="text-sm text-[#27187D] hover:text-[#472CE3] transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
      <Footer className="mt-8" />
    </main>
  );
}
