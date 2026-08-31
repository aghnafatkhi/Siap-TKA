'use client';

import { useAppStore } from '@/lib/store';
import { Target, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProgresPage() {
  const { profile, progress } = useAppStore();

  if (!profile) return null;

  // Group mistakes by topic for recommendations
  const mistakesByTopic = (progress.mistakes || []).reduce((acc, m) => {
    if (!acc[m.topicName]) {
      acc[m.topicName] = { lessonId: m.lessonId, subjectId: m.subjectId, count: 0 };
    }
    acc[m.topicName].count += 1;
    return acc;
  }, {} as Record<string, { lessonId: string, subjectId: string, count: number }>);

  const topMistake = Object.entries(mistakesByTopic)
    .sort((a, b) => b[1].count - a[1].count)[0];

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
            <h3 className="text-3xl font-bold text-slate-900">{(progress.completedLessons || []).length} <span className="text-sm font-medium text-slate-500">materi</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Total Selesai</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-amber-500 mb-4"><Calendar className="w-8 h-8" /></div>
            <h3 className="text-3xl font-bold text-slate-900">{progress.streakDays || 0} <span className="text-sm font-medium text-slate-500">hari</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Streak belajar</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="text-rose-500 mb-4"><AlertCircle className="w-8 h-8" /></div>
            <h3 className="text-3xl font-bold text-slate-900">{(progress.mistakes || []).length} <span className="text-sm font-medium text-slate-500">soal</span></h3>
            <p className="text-sm text-slate-500 mt-1 font-medium">Total Kesalahan</p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Kelemahan & Rekomendasi</h2>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
            {topMistake ? (
              <Link href={`/belajar/materi/${topMistake[1].lessonId}`} className="flex gap-4 items-start group">
                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-500 group-hover:bg-blue-600 transition-colors flex items-center justify-center text-white">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{topMistake[1].subjectId.toUpperCase()}: {topMistake[0]}</h4>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Kamu telah melakukan {topMistake[1].count} kesalahan di materi ini. Disarankan untuk mengulang kembali materi dasarnya sebelum lanjut.
                  </p>
                </div>
              </Link>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 font-medium">Belum ada data kelemahan yang signifikan. Terus berlatih!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
