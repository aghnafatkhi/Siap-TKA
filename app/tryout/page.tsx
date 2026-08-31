'use client';

import { Calendar, PlayCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { TRYOUTS } from '@/lib/data';

export default function TryoutPage() {
  const { progress } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Tryout & Simulasi
            </h1>
            <p className="text-white/70">
              Uji kemampuanmu dengan simulasi TKA.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <PlayCircle className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Tersedia</h2>
          
          <div className="space-y-4">
            {TRYOUTS.map(to => {
              const isCompleted = (progress.tryoutHistory || []).some((h: any) => h.id === to.id);
              
              return (
                <div key={to.id} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-lg">
                  <div>
                    {isCompleted ? (
                      <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold tracking-widest uppercase rounded-full mb-3 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                      </div>
                    ) : (
                      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase rounded-full mb-3">
                        Tersedia
                      </div>
                    )}
                    
                    <h3 className="text-xl font-bold text-slate-900">{to.title}</h3>
                    <p className="text-slate-500 mt-2">{to.description} {to.durationMinutes} menit.</p>
                  </div>
                  
                  <Link 
                    href={`/tryout/${to.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all shadow-lg shadow-blue-500/20"
                  >
                    <PlayCircle className="w-5 h-5" />
                    {isCompleted ? 'Kerjakan Ulang' : 'Mulai Tryout'}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Riwayat Tryout</h2>
          {(progress.tryoutHistory || []).length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
              <p className="text-slate-500 font-medium">Kamu belum mengikuti tryout apapun.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(progress.tryoutHistory || []).map((history: any, idx: number) => {
                const tryoutInfo = TRYOUTS.find(t => t.id === history.id) || { title: history.id };
                const date = new Date(history.date).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                });
                
                return (
                  <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">{tryoutInfo.title}</h3>
                      <p className="text-sm text-slate-500">{date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{history.score}</p>
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Skor</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
