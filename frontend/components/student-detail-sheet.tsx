'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { PaymentStatusBadge } from './payment-status-badge';
import { StudentRow } from './students-table';

interface Payment {
  id: number;
  amount: number;
  status: 'success' | 'pending';
  reference: string;
  created_at: string;
}

interface StudentDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentRow;
  onDelete: () => void;
}

export function StudentDetailSheet({
  isOpen,
  onClose,
  student,
  onDelete,
}: StudentDetailSheetProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  useEffect(() => {
    if (isOpen && student) {
      fetchPayments();
    }
  }, [isOpen, student]);

  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    setPayments([]);
    setIsLoadingPayments(false);
  };

  const totalPaid = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = student.fee_amount - totalPaid;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20"
          />

          {/* Sheet */}
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-black bg-white overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-black bg-white p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold">Student Details</h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Student Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Name</p>
                  <p className="mt-1 text-lg font-semibold text-black">{student.name}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Grade</p>
                  <p className="mt-1 text-lg font-semibold text-black">{student.grade}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Student ID (SID)</p>
                  <p className="mt-1 font-mono text-sm text-black">{student.student_id}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase">Payment Status</p>
                  <div className="mt-2">
                    <PaymentStatusBadge status={student.payment_status} />
                  </div>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="border border-black bg-white p-4">
                <h3 className="mb-4 font-semibold">Fee Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fee Amount</span>
                    <span className="font-semibold">
                      ₦{student.fee_amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-300 pt-2">
                    <span className="text-gray-600">Already Paid</span>
                    <span className="font-semibold text-black">
                      ₦{totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-black pt-2">
                    <span className="font-semibold">Remaining Balance</span>
                    <span className={`font-bold ${remainingBalance > 0 ? 'text-black' : 'text-gray-500'}`}>
                      ₦{remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="mb-3 font-semibold">Payment History</h3>
                {isLoadingPayments ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-12 border border-black bg-gray-100 animate-pulse" />
                    ))}
                  </div>
                ) : payments.length === 0 ? (
                  <div className="border border-black bg-white p-4 text-center text-sm text-gray-600">
                    No payments yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {payments.map((payment) => (
                      <div key={payment.id} className="border border-black bg-white p-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">
                            ₦{payment.amount.toLocaleString()}
                          </span>
                          <span className={`text-xs font-medium ${
                            payment.status === 'success'
                              ? 'text-green-700'
                              : 'text-yellow-700'
                          }`}>
                            {payment.status === 'success' ? '✓ Success' : '⏳ Pending'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{payment.reference}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => {
                  if (window.confirm('Delete this student record?')) {
                    onDelete();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-700 hover:bg-red-100 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Student
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
