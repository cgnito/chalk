import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { ProtectedRoute } from '@/lib/protected-route';

export const metadata = {
  title: 'Chalk | School Payments',
  description: 'School admin dashboard for managing students and payments',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-full min-h-screen bg-white text-black">
        <DashboardSidebar />
        <main className="ml-64 flex-1 border-l border-black">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
