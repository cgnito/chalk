'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Check, Copy, ArrowRight } from 'lucide-react';
import { AnimatedGrid } from '@/components/animated-grid';
import { usePublicOrigin, parentPortalUrl } from '@/lib/public-url';

export default function RegisterSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const origin = usePublicOrigin();

  const slug = searchParams.get('slug') || 'your-school';
  const portalUrl = parentPortalUrl(origin, slug);

  useEffect(() => {
    // Redirect to login if no slug provided
    if (!searchParams.get('slug')) {
      router.push('/');
    }
  }, [searchParams, router]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <main className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      <AnimatedGrid />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full mx-auto px-6 py-12"
      >
        {/* Success Checkmark */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-black mb-6">
            <Check size={48} className="text-black" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-black text-center mb-4"
        >
          School Account Created!
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-600 text-center mb-12"
        >
          Your school is now set up and ready to manage payments. Below is your public parent payment portal URL.
        </motion.p>

        {/* Portal URL Card */}
        <motion.div
          variants={itemVariants}
          className="border border-black p-8 mb-8 bg-white"
        >
          <p className="text-sm font-semibold text-gray-700 mb-3">YOUR PUBLIC PARENT PORTAL</p>
          <div className="flex items-center justify-between gap-4 mb-4">
            <code className="text-lg font-mono font-bold text-black break-all">
              {portalUrl}
            </code>
          </div>
          <button
            onClick={handleCopyUrl}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'Copy URL'}
          </button>
          <p className="text-sm text-gray-600 mt-4">
            Share this URL with parents so they can find your school and make payments.
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          variants={itemVariants}
          className="border-l-4 border-black pl-6 mb-12"
        >
          <h3 className="font-bold text-lg mb-3">What&apos;s Next?</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Your account is active and ready to use</li>
            <li>✓ Share your parent portal URL with families</li>
            <li>✓ Add students to start accepting payments</li>
            <li>✓ Track all payments from your dashboard</li>
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <Link
            href="/dashboard"
            className="group px-8 py-3 bg-black text-white font-semibold border border-black flex items-center gap-2 hover:bg-gray-900 transition-all"
          >
            Go to Dashboard
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/"
            className="px-8 py-3 bg-white text-black font-semibold border border-black hover:bg-gray-50 transition-all"
          >
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
