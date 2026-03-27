'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, DollarSign, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { usePublicOrigin, portalDisplayHostPath } from '@/lib/public-url';

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, schoolName, schoolSlug } = useAuth();
  const origin = usePublicOrigin();
  const portalPath =
    schoolSlug != null && schoolSlug !== ''
      ? portalDisplayHostPath(origin, schoolSlug)
      : '';

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Students',
      href: '/dashboard/students',
      icon: Users,
    },
    {
      name: 'Payments',
      href: '/dashboard/payments',
      icon: DollarSign,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 border-r border-black bg-white p-0 flex flex-col">
      {/* Logo/Header */}
      <div className="border-b border-black px-6 py-8">
        <Link href="/dashboard" className="text-2xl font-bold tracking-tight">
          CHALK
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* School Info & Logout */}
      <div className="border-t border-black px-4 py-4 space-y-3">
        {(schoolName || schoolSlug) && (
          <div className="text-xs text-gray-600 px-2">
            {schoolName && <p className="font-semibold text-black">{schoolName}</p>}
            {portalPath && (
              <p className="text-gray-500 truncate">{portalPath}</p>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded px-4 py-3 text-sm font-medium text-black hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
