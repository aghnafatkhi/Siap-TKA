'use client';

import { useAppStore } from '@/lib/store';
import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PengaturanPage() {
  const { profile, setProfile } = useAppStore();
  const router = useRouter();

  if (!profile) return null;

  const handleReset = () => {
    if (confirm('Yakin ingin mereset data? Ini akan mengulangi pengaturan awal.')) {
      setProfile({
        ...profile,
        name: '',
        onboardingCompleted: false
      });
      router.push('/');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Pengaturan
            </h1>
            <p className="text-white/70">
              Kelola profil dan preferensi aplikasimu.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <Settings className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Profil Siswa</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">Nama</p>
                <p className="font-bold text-slate-900 text-lg">{profile.name}</p>
              </div>
            </div>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div>
                <p className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">Target Waktu Belajar</p>
                <p className="font-bold text-slate-900 text-lg">{profile.dailyStudyTime} menit/hari</p>
              </div>
            </div>
            <div className="p-6 bg-slate-50">
              <button onClick={handleReset} className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-2 transition-colors">
                <LogOut className="w-5 h-5" />
                Ulangi Pengaturan Awal
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
