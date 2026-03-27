'use client';

import { motion } from 'framer-motion';

export function AnimatedGrid() {
  return (
    <motion.div
      className="absolute inset-0 -z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ transformOrigin: '50% 50%' }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#000" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </motion.svg>

      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(0,0,0,0.05) 0%, transparent 60%)',
            'radial-gradient(circle at 70% 50%, rgba(0,0,0,0.05) 0%, transparent 60%)',
            'radial-gradient(circle at 30% 50%, rgba(0,0,0,0.05) 0%, transparent 60%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
