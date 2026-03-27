'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16"
    >
      {/* Main Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-7xl md:text-8xl font-black text-center mb-6 leading-none max-w-4xl"
      >
        Streamline School Payments
      </motion.h1>

      {/* Subheading */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-12 leading-relaxed"
      >
        Chalk is a modern fee management platform that simplifies how schools collect and track payments.
        Transparent, secure, and built for parents and schools alike.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4 items-center"
      >
        <Link
          href="/register"
          className="group px-8 py-3 bg-black text-white font-semibold border border-black flex items-center gap-2 hover:bg-white hover:text-black transition-all duration-200"
        >
          Register School
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/"
          className="px-8 py-3 bg-white text-black font-semibold border border-black hover:bg-gray-50 transition-all duration-200"
        >
          Parent Payment Portal
        </Link>
      </motion.div>

      {/* Trust Indicators */}
      <motion.div
        variants={itemVariants}
        className="mt-20 pt-12 border-t border-gray-300 w-full max-w-3xl"
      >
        <p className="text-sm text-gray-500 text-center mb-6">
          Trusted by schools across Africa
        </p>
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold">500+</p>
            <p className="text-sm text-gray-600">Schools</p>
          </div>
          <div>
            <p className="text-3xl font-bold">50K+</p>
            <p className="text-sm text-gray-600">Students</p>
          </div>
          <div>
            <p className="text-3xl font-bold">99.9%</p>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
