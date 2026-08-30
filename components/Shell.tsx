'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import Onboarding from './Onboarding';
import { BookOpen, Calendar, Home, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Shell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { profile, resetDailyProgressIfNeeded } = useAppStore();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    resetDailyProgressIfNeeded();
  }, [resetDailyProgressIfNeeded]);

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-screen">Memuat...</div>;
  }

  if (!profile?.onboardingCompleted) {
    return <Onboarding />;
  }

  const navItems = [
    { name: 'Hari Ini', href: '/', icon: Home },
    { name: 'Belajar', href: '/belajar', icon: BookOpen },
    { name: 'Tryout', href: '/tryout', icon: Calendar },
    { name: 'Progres', href: '/progres', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white shrink-0">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-lg">S</div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Siap TKA</span>
          </div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 space-y-4">
          <Link
            href="/pengaturan"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Settings className="h-5 w-5" />
            Pengaturan
          </Link>
          <div className="bg-slate-100 rounded-xl p-4">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target TKA</p>
            <p className="text-sm font-semibold text-slate-900">
              {profile.targetDate ? `${Math.max(0, Math.ceil((new Date(profile.targetDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} Hari Lagi` : 'Belum diatur'}
            </p>
            <div className="w-full bg-slate-300 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white pb-safe z-50">
        <div className="flex h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 ${
                  isActive ? 'text-blue-700' : 'text-slate-500'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
