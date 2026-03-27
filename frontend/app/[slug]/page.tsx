'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { StudentSearchInput } from '@/components/student-search-input';
import { StudentProfileCard } from '@/components/student-profile-card';
import { PaymentModal } from '@/components/payment-modal';

export default function ParentPortalPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleStudentFound = (foundStudent: any) => {
    setStudent(foundStudent);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-16 sm:py-24">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-black">
            Payment Portal
          </h1>
          <p className="mt-2 text-gray-500 text-sm font-mono uppercase tracking-widest">
            Enter Student ID to access fee records
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {!student ? (
            <StudentSearchInput
              schoolSlug={slug}
              onStudentFound={handleStudentFound}
              isLoading={isLoading}
            />
          ) : (
            <div className="space-y-8 flex flex-col items-center">
              <StudentProfileCard
                student={student}
                onPay={() => setShowPaymentModal(true)}
                isLoading={isLoading}
              />

              <button
                onClick={() => setStudent(null)}
                className="text-black border-b border-black hover:opacity-50 text-xs font-bold uppercase tracking-widest font-mono transition-opacity"
              >
                ← Search Another Student
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-black text-center text-[10px] text-gray-500 uppercase tracking-widest font-mono">
          <p>Secure encryption enabled • Powered by Interswitch</p>
          <p className="mt-2 text-[9px]">
            Contact administration for billing inquiries.
          </p>
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && student && (
        <PaymentModal
          student={student}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
}