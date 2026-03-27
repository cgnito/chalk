'use client';

import { useEffect, useState } from 'react';
import { DashboardOverviewCard } from '@/components/dashboard-overview-card';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { api, paymentAPI } from '@/lib/api';

interface Student {
  id: number;
  name: string;
  grade: string;
  student_id: string;
  fee_amount: number;
  payment_status: 'Paid' | 'Partial' | 'Unpaid';
}

interface Payment {
  id: number;
  amount: number;
  status: 'success' | 'pending';
}

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const studentsRes = await api.get('/students/');
        setStudents(studentsRes.data);

        const paymentsRes = await paymentAPI.getHistory();
        setPayments(paymentsRes.data);
      } catch {
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStudents = students.length;
  const totalExpectedFees = students.reduce((sum, s) => sum + s.fee_amount, 0);
  const totalRevenue = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + p.amount, 0);
  const collectionProgress = totalExpectedFees > 0 
    ? Math.round((totalRevenue / totalExpectedFees) * 100) 
    : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 border-b border-black pb-6">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your school&apos;s fee collection</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 border border-red-300 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <DashboardOverviewCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="h-6 w-6" />}
          subtitle={`Active students in your school`}
        />

        <DashboardOverviewCard
          title="Total Expected Fees"
          value={`₦${totalExpectedFees.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6" />}
          subtitle="Sum of all student fees"
        />

        <DashboardOverviewCard
          title="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6" />}
          subtitle="Successful payments only"
          trend={{
            value: collectionProgress,
            direction: collectionProgress >= 50 ? 'up' : 'down',
          }}
        />

        <DashboardOverviewCard
          title="Collection Progress"
          value={`${collectionProgress}%`}
          subtitle={`${((totalRevenue / totalExpectedFees) * 100).toFixed(1)}% of fees collected`}
        />
      </div>

      {/* Collection Progress Bar */}
      <div className="mb-8 border border-black bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Overall Collection Progress</h2>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600">Collected</span>
          <span className="text-sm font-semibold">
            ₦{totalRevenue.toLocaleString()} / ₦{totalExpectedFees.toLocaleString()}
          </span>
        </div>
        <div className="h-8 border border-black bg-white overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-500"
            style={{ width: `${collectionProgress}%` }}
          />
        </div>
        <div className="mt-2 text-right text-sm font-bold">{collectionProgress}%</div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="border border-black bg-white p-6">
          <h3 className="text-sm font-medium text-gray-600">Paid Students</h3>
          <p className="mt-2 text-3xl font-bold">
            {students.filter((s) => s.payment_status === 'Paid').length}
          </p>
        </div>

        <div className="border border-black bg-white p-6">
          <h3 className="text-sm font-medium text-gray-600">Partial Payments</h3>
          <p className="mt-2 text-3xl font-bold">
            {students.filter((s) => s.payment_status === 'Partial').length}
          </p>
        </div>

        <div className="border border-black bg-white p-6">
          <h3 className="text-sm font-medium text-gray-600">Unpaid Students</h3>
          <p className="mt-2 text-3xl font-bold">
            {students.filter((s) => s.payment_status === 'Unpaid').length}
          </p>
        </div>
      </div>
    </div>
  );
}
