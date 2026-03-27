'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border-b border-black fixed top-0 left-0 right-0 bg-white z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* CHALK Wordmark */}
        <Link href="/">
          <span className="text-2xl font-black tracking-tight hover:opacity-70 transition-opacity">
            CHALK
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-sm font-medium border-b border-transparent hover:border-black transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium px-4 py-2 bg-black text-white hover:opacity-80 transition-opacity"
          >
            Register School
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
