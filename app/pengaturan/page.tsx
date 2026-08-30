'use client';

import { useAppStore } from '@/lib/store';
import { Settings, LogOut, Database, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PengaturanPage() {
  const { profile, setProfile } = useAppStore();
  const router = useRouter();

  if (!profile) return null;

  const handleReset = () => {
    if (confirm('Yakin ingin mereset data?')) {
      // Create a copy but with onboardingCompleted = false
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

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Panel Admin (Demo)</h2>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <p className="text-slate-500 text-sm font-medium">Panel sederhana untuk mengelola status validasi materi dan soal TKA. (Hanya terlihat oleh admin)</p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Bank Soal Internal</p>
                    <p className="text-sm text-slate-500">1250 soal tersedia</p>
                  </div>
                </div>
                <button className="text-indigo-600 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">Kelola</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Validasi Materi</p>
                    <p className="text-sm text-slate-500">12 materi menunggu review</p>
                  </div>
                </div>
                <button className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">Review</button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
