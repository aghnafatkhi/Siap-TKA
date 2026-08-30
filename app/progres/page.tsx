'use client';

import { useAppStore } from '@/lib/store';
import { Target, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function ProgresPage() {
  const { profile, progress } = useAppStore();

  if (!profile) return null;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Progres Belajar
            </h1>
            <p className="text-white/70">
              Pantau perkembangan dan target belajarmu di sini.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <TrendingUp className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-blue-500 mb-4"><Target className="w-8 h-8" /></div>
            <h3 className="text-3xl font-bold text-slate-900">{progress.dailyProgressMinutes} <span className="text-sm font-medium text-slate-500">mnt</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Belajar hari ini</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-emerald-500 mb-4"><TrendingUp className="w-8 h-8" /></div>
            <h3 className="text-3xl font-bold text-slate-900">4 <span className="text-sm font-medium text-slate-500">materi</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Selesai minggu ini</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-amber-500 mb-4"><Calendar className="w-8 h-8" /></div>
            <h3 className="text-3xl font-bold text-slate-900">7 <span className="text-sm font-medium text-slate-500">hari</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Streak belajar</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-indigo-500 mb-4"><AlertCircle className="w-8 h-8" /></div>
            <h3 className="text-3xl font-bold text-slate-900">12 <span className="text-sm font-medium text-slate-500">soal</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Kesalahan minggu ini</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Kelemahan & Rekomendasi</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Matematika: Kombinatorika</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">Tingkat akurasi latihanmu di materi ini masih di bawah 50%. Disarankan untuk mengulang kembali materi dasarnya sebelum lanjut.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
