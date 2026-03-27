import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/hero-section';
import { AnimatedGrid } from '@/components/animated-grid';

export const metadata = {
  title: 'Chalk | School Payments',
  description: 'Modern fee management platform for schools. Transparent, secure, and built for parents.',
};

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <AnimatedGrid />
      <Navbar />
      <HeroSection />
    </main>
  );
}
