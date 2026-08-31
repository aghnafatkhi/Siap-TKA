'use client';

import { useAppStore } from '@/lib/store';
import { TOPICS, SUBJECTS } from '@/lib/data';
import { BookOpen, ChevronRight, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function BelajarIndex() {
  const { profile, progress } = useAppStore();

  if (!profile) return null;

  const subjects = [
    { id: 'indonesia', name: 'Bahasa Indonesia', type: 'wajib' },
    { id: 'matematika', name: 'Matematika', type: 'wajib' },
    { id: 'inggris', name: 'Bahasa Inggris', type: 'wajib' },
    ...profile.additionalSubjects.map(sub => {
      const found = SUBJECTS.find(s => s.name === sub);
      return {
        id: found ? found.id : sub.toLowerCase().replace(/\s+/g, '-'),
        name: sub,
        type: 'pilihan'
      };
    })
  ];

  const getProgress = (subjectId: string) => {
    const totalTopics = TOPICS[subjectId]?.length || 0;
    if (totalTopics === 0) return { total: 0, completed: 0 };
    
    const completedCount = TOPICS[subjectId].filter(t => 
      (progress.completedLessons || []).includes(t.id)
    ).length;

    return { total: totalTopics, completed: completedCount };
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Materi Belajar
            </h1>
            <p className="text-white/70">
              Pilih mata pelajaran yang ingin kamu pelajari hari ini. Fokus pada area yang perlu ditingkatkan.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <BookOpen className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <div className="space-y-6">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Wajib</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.filter(s => s.type === 'wajib').map((subject) => {
              const { total, completed } = getProgress(subject.id);
              return (
                <Link 
                  key={subject.id} 
                  href={`/belajar/${subject.id}`}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-slate-500 font-medium flex items-center justify-between">
                      <span>{total > 0 ? `${completed}/${total} Kompetensi` : 'Materi disiapkan'}</span>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase mt-4">Pilihan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.filter(s => s.type === 'pilihan').map((subject) => {
              const { total, completed } = getProgress(subject.id);
              return (
                <Link 
                  key={subject.id} 
                  href={`/belajar/${subject.id}`}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{subject.name}</h3>
                  </div>
                  <div className="mt-auto">
                    <p className="text-sm text-slate-500 font-medium flex items-center justify-between">
                      <span>{total > 0 ? `${completed}/${total} Kompetensi` : 'Materi disiapkan'}</span>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
