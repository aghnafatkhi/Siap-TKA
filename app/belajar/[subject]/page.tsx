'use client';

import { useParams, useRouter } from 'next/navigation';
import { TOPICS, SUBJECTS } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { ChevronLeft, BookOpen, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const { progress } = useAppStore();

  const subjectInfo = SUBJECTS.find(s => s.id === subjectId) || { name: subjectId.toUpperCase() };
  const topics = TOPICS[subjectId] || [];

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center shrink-0 sticky top-0 bg-white z-10 shadow-sm">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-slate-900 text-lg ml-2">{subjectInfo.name}</h1>
      </header>

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        {topics.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Materi Sedang Disiapkan</h2>
            <p className="text-slate-500">Kami sedang menyusun materi terbaik untuk mata pelajaran ini. Silakan pilih mata pelajaran lain untuk sementara.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topics.map(topic => {
              const isCompleted = (progress.completedLessons || []).includes(topic.id);
              
              return (
                <Link 
                  key={topic.id}
                  href={`/belajar/materi/${topic.id}`}
                  className="flex items-start p-4 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all group"
                >
                  <div className="flex-shrink-0 mr-4">
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 group-hover:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {topic.competency}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {topic.summary}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
