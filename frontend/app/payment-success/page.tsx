'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { PaymentReceipt } from '@/components/payment-receipt';
import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found. Unable to verify payment.');
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/payments/verify/${encodeURIComponent(reference)}`
        );

        if (!response.ok) {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
          return;
        }

        const data = await response.json();
        setPaymentData(data);

        if (
          data.status === 'approved' ||
          data.status === 'success' ||
          data.payment_status === 'success'
        ) {
          setStatus('success');
          setMessage(
            'Payment verified successfully! Your payment has been recorded.'
          );
        } else {
          setStatus('error');
          setMessage('Payment could not be verified. Please check with your bank.');
        }
      } catch {
        setStatus('error');
        setMessage(
          'Failed to verify payment. Please contact support with your transaction reference: ' +
            reference
        );
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Loading State */}
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-6 min-h-96"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-12 h-12 text-black" />
            </motion.div>
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-black">Verifying Payment...</p>
              <p className="text-sm text-gray-600">
                Please do not close this page while we confirm your transaction.
              </p>
            </div>
          </motion.div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4, type: 'spring', stiffness: 100 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-black opacity-10 animate-pulse"></div>
                <CheckCircle className="w-24 h-24 text-black relative" />
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-3"
            >
              <h1 className="text-4xl font-bold text-black">Payment Successful!</h1>
              <p className="text-lg text-gray-600">
                Your payment has been verified and recorded.
              </p>
            </motion.div>

            {/* Printable Receipt */}
            {paymentData && (
              <PaymentReceipt
                reference={reference || ''}
                amount={paymentData.amount}
                date={
                  paymentData.created_at
                    ? new Date(paymentData.created_at).toLocaleDateString()
                    : new Date().toLocaleDateString()
                }
              />
            )}

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 border border-black p-6 space-y-3"
            >
              <p className="text-sm font-semibold text-black">What Happens Next?</p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✓ Your payment receipt has been sent to your email (if provided)</li>
                <li>✓ Your student record has been updated</li>
                <li>✓ The school will confirm receipt within 24 hours</li>
              </ul>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/"
                className="w-full px-4 py-3 bg-black text-white font-semibold hover:bg-gray-900 text-center transition-colors duration-200 block"
              >
                Return to Home
              </Link>
            </motion.div>
          </motion.div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-center"
            >
              <AlertCircle className="w-24 h-24 text-black" />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center space-y-3"
            >
              <h1 className="text-4xl font-bold text-black">Payment Verification Failed</h1>
              <p className="text-lg text-gray-600">{message}</p>
            </motion.div>

            {/* Reference Display */}
            {reference && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-black p-6 space-y-2 bg-gray-50"
              >
                <p className="text-sm text-gray-600">Transaction Reference</p>
                <p className="font-mono font-bold text-black break-all">{reference}</p>
                <p className="text-xs text-gray-600 mt-3">
                  Please save this reference for your records and contact support if you need
                  assistance.
                </p>
              </motion.div>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3"
            >
              <Link
                href="/"
                className="w-full px-4 py-3 bg-black text-white font-semibold hover:bg-gray-900 text-center transition-colors duration-200"
              >
                Return to Home
              </Link>
              <button
                onClick={() => window.history.back()}
                className="w-full px-4 py-3 border border-black text-black font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Go Back
              </button>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
