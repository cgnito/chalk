import { Navbar } from '@/components/navbar';
import { AnimatedGrid } from '@/components/animated-grid';
import { SchoolRegisterForm } from '@/components/school-register-form';
import { motion } from 'framer-motion';

export const metadata = {
  title: 'Chalk | School Payments',
  description: 'Sign up your school to start managing fees.',
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <AnimatedGrid />
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-20 pt-32">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black mb-4">Register Your School</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Set up your school account and start managing payments today. Includes your public parent portal.
          </p>
        </div>

        {/* Form */}
        <SchoolRegisterForm />
      </div>
    </main>
  );
}
