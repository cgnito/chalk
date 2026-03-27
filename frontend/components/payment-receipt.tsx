'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';

interface PaymentReceiptProps {
  reference: string;
  amount?: number;
  studentName?: string;
  studentId?: string;
  date?: string;
  schoolName?: string;
}

export function PaymentReceipt({
  reference,
  amount,
  studentName,
  studentId,
  date,
  schoolName = 'Chalk School Portal',
}: PaymentReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(receiptRef.current.innerHTML);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-4"
    >
      {/* Receipt Container */}
      <div
        ref={receiptRef}
        className="border-2 border-black bg-white p-8 font-mono text-sm max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center border-b border-black pb-4 mb-4">
          <h2 className="text-xl font-bold tracking-wider">CHALK</h2>
          <p className="text-xs text-gray-700 mt-1">PAYMENT RECEIPT</p>
          <p className="text-xs text-gray-600 mt-2">{schoolName}</p>
        </div>

        {/* Receipt Details */}
        <div className="space-y-3 border-b border-black pb-4 mb-4">
          {/* Reference */}
          <div className="flex justify-between text-xs">
            <span className="text-gray-700">Reference:</span>
            <span className="font-bold break-all text-right">{reference}</span>
          </div>

          {/* Date */}
          {date && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-700">Date:</span>
              <span className="font-bold">{date}</span>
            </div>
          )}

          {/* Student Name */}
          {studentName && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-700">Student:</span>
              <span className="font-bold text-right">{studentName}</span>
            </div>
          )}

          {/* Student ID */}
          {studentId && (
            <div className="flex justify-between text-xs">
              <span className="text-gray-700">SID:</span>
              <span className="font-bold">{studentId}</span>
            </div>
          )}

          {/* Amount */}
          {amount && (
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-300">
              <span className="text-gray-700">Amount:</span>
              <span className="font-bold">₦{amount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="text-center space-y-2 border-b border-black pb-4 mb-4">
          <p className="text-xs font-bold tracking-widest">PAYMENT SUCCESSFUL</p>
          <p className="text-xs text-gray-600">Thank you for your payment</p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 space-y-1">
          <p>This is your official payment receipt.</p>
          <p>Please keep this for your records.</p>
          <p className="pt-2 text-xs">© 2024 Chalk School Payments</p>
        </div>
      </div>

      {/* Print Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={handlePrint}
        className="w-full flex items-center justify-center gap-2 border border-black px-4 py-3 font-semibold hover:bg-gray-50 transition-colors"
      >
        <Printer className="h-4 w-4" />
        Print Receipt
      </motion.button>
    </motion.div>
  );
}
