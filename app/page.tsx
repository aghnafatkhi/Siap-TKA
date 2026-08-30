'use client';

import { useAppStore } from '@/lib/store';
import { differenceInDays, parseISO } from 'date-fns';
import { ChevronRight, Target, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function HariIni() {
  const { profile, progress } = useAppStore();

  if (!profile) return null;

  let daysRemaining = 0;
  if (profile.targetDate) {
    const target = parseISO(profile.targetDate);
    daysRemaining = differenceInDays(target, new Date());
    if (daysRemaining < 0) daysRemaining = 0;
  }

  const progressPercentage = Math.min(
    Math.round((progress.dailyProgressMinutes / profile.dailyStudyTime) * 100),
    100
  );

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        
        {/* Header Section */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4">Siap TKA</span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Halo, {profile.name} 👋
            </h1>
            <p className="text-white/70 mb-6">
              Ada <span className="font-bold text-white">{daysRemaining} hari</span> lagi menuju ujian TKA-mu. Fokus hari ini: capai target belajarmu.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <Target className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Daily Target Section */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase">Target Belajar Hari Ini</h2>
                <div className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-lg text-xs">
                  <Clock className="w-4 h-4" />
                  {progress.dailyProgressMinutes} / {profile.dailyStudyTime} mnt
                </div>
              </div>
              
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <Link
                href="/belajar/sesi/baru"
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                Mulai Belajar Sekarang
                <ChevronRight className="w-5 h-5" />
              </Link>
            </section>

            {/* Needs Improvement Section */}
            <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Riwayat Kesalahan & Rekomendasi
              </h2>
              <div className="space-y-3">
                <Link href="/belajar/materi/matematika-peluang" className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-bold text-sky-900 text-sm">Matematika: Peluang</h3>
                    <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">Sering keliru di konsep kombinatorika. Coba ulangi.</p>
                  </div>
                </Link>
                <Link href="/belajar/materi/indonesia-paragraf" className="flex items-start p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-bold text-sky-900 text-sm">B. Indonesia: Ide Pokok</h3>
                    <p className="text-xs text-sky-800 mt-0.5 leading-relaxed">Coba ulangi latihan menentukan kalimat utama.</p>
                  </div>
                </Link>
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            {/* Next Schedule Section */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase mb-4">Jadwal Berikutnya</h2>
              <div className="relative space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                <div className="relative flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Bahasa Inggris (Wajib)</p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 15 menit
                    </p>
                  </div>
                </div>
                {profile.additionalSubjects.length > 0 && (
                  <div className="relative flex gap-4 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 z-10">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{profile.additionalSubjects[0]} (Pilihan)</p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 15 menit
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-600/10">
              <p className="text-xs font-medium text-emerald-100 mb-1">Statistik Belajar</p>
              <p className="text-2xl font-bold">7 Hari Berturut-turut</p>
              <p className="text-[10px] mt-2 opacity-80 uppercase tracking-widest font-bold">🔥🔥 Pertahankan Semangatmu!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
