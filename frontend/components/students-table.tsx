'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { PaymentStatusBadge } from './payment-status-badge';

export interface StudentRow {
  id: number;
  name: string;
  grade: string; // Ensure this is present
  student_id: string; // The "STU-001" value
  fee_amount: number;
  payment_status: 'Paid' | 'Partial' | 'Unpaid';
  total_paid?: number;
}

interface StudentsTableProps {
  students: StudentRow[];
  onRowClick: (student: StudentRow) => void;
  isLoading?: boolean;
}

export function StudentsTable({
  students,
  onRowClick,
  isLoading = false,
}: StudentsTableProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 border border-black bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="border border-black bg-white p-12 text-center space-y-4"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 border border-black flex items-center justify-center bg-gray-50">
             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-black mb-1">No Students Found</h3>
          <p className="text-gray-600 text-sm">Add students to this class to see them here.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="border border-black overflow-hidden">
      <div className="grid grid-cols-5 border-b border-black bg-gray-50 font-semibold text-sm">
        <div className="p-4">Name</div>
        <div className="p-4">Grade</div>
        <div className="p-4">SID</div>
        <div className="p-4">Fee Amount</div>
        <div className="p-4">Status</div>
      </div>

      <div>
        {students.map((student, idx) => {
          const isSelected = selectedId === student.id;
          return (
            <motion.div key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
              <button
                onClick={() => {
                  setSelectedId(isSelected ? null : student.id);
                  onRowClick(student);
                }}
                className={`w-full grid grid-cols-5 gap-0 border-b border-black py-0 transition-colors ${
                  isSelected ? 'bg-black text-white' : 'bg-white hover:bg-gray-50 text-black'
                }`}
              >
                <div className="p-4 text-left text-sm font-medium">{student.name}</div>
                <div className="p-4 text-left text-sm">{student.grade}</div>
                <div className="p-4 text-left text-sm font-mono">{student.student_id}</div>
                <div className="p-4 text-left text-sm font-semibold">₦{student.fee_amount.toLocaleString()}</div>
                <div className="p-4 flex items-center justify-between">
                  <PaymentStatusBadge status={student.payment_status} className={isSelected ? 'bg-white text-black border-white' : ''} />
                  <ChevronDown className={`h-4 w-4 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
