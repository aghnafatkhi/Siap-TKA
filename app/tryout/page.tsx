'use client';

import { Calendar, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function TryoutPage() {
  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Tryout & Simulasi
            </h1>
            <p className="text-white/70">
              Uji kemampuanmu dengan simulasi TKA sesuai standar resmi.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <PlayCircle className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Tersedia</h2>
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-lg">
            <div>
              <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase rounded-full mb-3">
                Terbaru
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tryout Internal #1</h3>
              <p className="text-slate-500 mt-2">Simulasi lengkap 5 mata pelajaran. 120 menit.</p>
              <div className="flex items-center gap-4 mt-4 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Buka s/d 30 Okt</span>
              </div>
            </div>
            
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-blue-500/20">
              <PlayCircle className="w-5 h-5" />
              Mulai Tryout
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Riwayat Tryout</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-slate-500 font-medium">Kamu belum mengikuti tryout apapun.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
