import { Navbar } from '@/components/navbar';
import { AnimatedGrid } from '@/components/animated-grid';
import { SchoolLoginForm } from '@/components/school-login-form';

export const metadata = {
  title: 'Chalk | School Payments',
  description: 'Sign in to your school dashboard.',
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <AnimatedGrid />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-20 pt-32">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4">School Login</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sign in to your dashboard to manage students and payments.
          </p>
        </div>

        {/* Form */}
        <SchoolLoginForm />
      </div>
    </main>
  );
}
