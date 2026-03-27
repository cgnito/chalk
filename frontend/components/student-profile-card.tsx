'use client';

import { motion } from 'framer-motion';
import { PaymentStatusBadge } from './payment-status-badge';

interface StudentProfileCardProps {
  student: {
    id: number;
    name: string;
    grade: string;
    student_id: string;
    fee_amount: number;
    payment_status: string;
    total_paid?: number;
  };
  onPay: () => void;
  isLoading: boolean;
}

export function StudentProfileCard({
  student,
  onPay,
  isLoading,
}: StudentProfileCardProps) {
  const totalPaid = student.total_paid || 0;
  const balance = Math.max(0, student.fee_amount - totalPaid);
  const collectionPercent = (totalPaid / student.fee_amount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full border border-black bg-white p-6 space-y-6"
    >
      {/* Student Info Header */}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 uppercase tracking-wider">Student Name</p>
          <h2 className="text-2xl font-bold text-black">{student.name}</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-600 uppercase">Grade</p>
            <p className="text-lg font-semibold text-black">{student.grade}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase">Student ID</p>
            <p className="text-sm font-mono text-black">{student.student_id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase">Status</p>
            <PaymentStatusBadge status={student.payment_status} />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-black"></div>

      {/* Fee Breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-black">
          Fee Breakdown
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Total Fee Amount</span>
            <span className="font-semibold text-black">
              ₦{student.fee_amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-700">Already Paid</span>
            <span className="font-semibold text-black">
              ₦{totalPaid.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-1 border border-black">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(collectionPercent, 100)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-black"
          ></motion.div>
        </div>

        <p className="text-xs text-gray-600">{collectionPercent.toFixed(0)}% paid</p>
      </div>

      {/* Balance Due */}
      <div className="bg-black text-white p-4 space-y-1">
        <p className="text-xs uppercase tracking-wider">Balance Remaining</p>
        <p className="text-3xl font-bold">₦{balance.toLocaleString()}</p>
      </div>

      {/* Pay Button */}
      <button
        onClick={onPay}
        disabled={balance <= 0 || isLoading}
        className="w-full px-4 py-3 bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {balance <= 0 ? 'Fully Paid' : 'Pay Now'}
      </button>
    </motion.div>
  );
}
