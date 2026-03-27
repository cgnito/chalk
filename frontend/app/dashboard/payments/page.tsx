'use client';

import { useEffect, useState } from 'react';
import { paymentAPI } from '@/lib/api';

interface PaymentRecord {
  id: number;
  student_pk_id: number;
  student_name?: string;
  amount: number;
  status: 'success' | 'pending';
  reference: string;
  created_at: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        const response = await paymentAPI.getHistory();
        setPayments(response.data);
      } catch {
        setError('Failed to load payments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const successfulPayments = payments.filter((p) => p.status === 'success');
  const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-black pb-6">
        <h1 className="text-4xl font-bold">Payments</h1>
        <p className="mt-2 text-gray-600">All payment transactions for your school</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="border border-black bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Total Transactions</p>
          <p className="mt-2 text-3xl font-bold">{payments.length}</p>
        </div>

        <div className="border border-black bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Successful Payments</p>
          <p className="mt-2 text-3xl font-bold">{successfulPayments.length}</p>
        </div>

        <div className="border border-black bg-white p-6">
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold">₦{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Payments Table */}
      <div className="border border-black overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-5 border-b border-black bg-gray-50 font-semibold text-sm">
          <div className="p-4">Date</div>
          <div className="p-4">Amount</div>
          <div className="p-4">Reference</div>
          <div className="p-4">Status</div>
          <div className="p-4">Student ID</div>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-b border-black bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="border-b border-black bg-white p-8 text-center">
            <p className="text-gray-600">No payments found yet.</p>
          </div>
        ) : (
          <div>
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="grid grid-cols-5 border-b border-black bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="p-4 text-sm">
                  {new Date(payment.created_at).toLocaleDateString()}
                </div>
                <div className="p-4 text-sm font-semibold">
                  ₦{payment.amount.toLocaleString()}
                </div>
                <div className="p-4 text-sm font-mono">{payment.reference}</div>
                <div className="p-4 text-sm">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium ${
                      payment.status === 'success'
                        ? 'bg-black text-white'
                        : 'border border-black text-black'
                    }`}
                  >
                    {payment.status === 'success' ? '✓ Success' : '⏳ Pending'}
                  </span>
                </div>
                <div className="p-4 text-sm text-gray-600">{payment.student_pk_id}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
