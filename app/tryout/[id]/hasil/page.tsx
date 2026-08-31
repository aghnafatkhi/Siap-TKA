'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { TRYOUTS, SUBJECTS, Question } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { CheckCircle2, AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function TryoutHasil() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { profile } = useAppStore();
  
  const [result, setResult] = useState<any>(null);
  
  const tryoutBase = useMemo(() => TRYOUTS.find(t => t.id === id), [id]);

  const tryoutQuestions = useMemo(() => {
    if (!tryoutBase || !profile) return [];
    const requiredSubjectIds = SUBJECTS.filter(s => s.type === 'wajib').map(s => s.id);
    const selectedSubjectIds = profile.additionalSubjects || [];
    const validSubjectIds = [...requiredSubjectIds, ...selectedSubjectIds];
    return tryoutBase.questions.filter(q => validSubjectIds.includes(q.subjectId));
  }, [tryoutBase, profile]);

  useEffect(() => {
    const storedResult = localStorage.getItem(`temp_hasil_${id}`);
    if (storedResult) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResult(JSON.parse(storedResult));
    } else {
      router.replace('/tryout');
    }
  }, [id, router]);

  if (!result || !tryoutBase || !profile) {
    return <div className="p-8 text-center">Memuat hasil...</div>;
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex flex-col bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        
        {/* Score Header */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-6 text-slate-300">Skor Tryout</h1>
            <div className="text-7xl font-black text-white mb-4 tracking-tighter">
              {result.score}
            </div>
            <p className="text-lg text-slate-400 font-medium">
              Benar {result.correct} dari {result.total} soal
            </p>
          </div>
        </section>

        {/* Detailed Review */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold tracking-wider text-slate-500 uppercase">Pembahasan</h2>
          <div className="space-y-4">
            {tryoutQuestions.map((q: Question, idx: number) => {
              const userAnswer = result.answers[idx];
              const isCorrect = userAnswer === q.correctIndex;
              
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-600">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded uppercase tracking-wider">
                      {q.subjectName}
                    </span>
                    {isCorrect ? (
                      <span className="ml-auto flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        <CheckCircle2 className="w-4 h-4" /> Benar
                      </span>
                    ) : (
                      <span className="ml-auto flex items-center gap-1 text-sm font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">
                        <AlertCircle className="w-4 h-4" /> Salah
                      </span>
                    )}
                  </div>

                  {q.stimulusType === 'text' && q.stimulus && (
                    <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {q.stimulus}
                      </p>
                    </div>
                  )}
                  
                  <p className="text-slate-900 font-medium mb-4">{q.question}</p>
                  
                  <div className="space-y-2 mb-6 opacity-60">
                    <p className="text-sm">
                      <span className="font-semibold">Jawaban Kamu:</span> {userAnswer !== undefined ? q.options[userAnswer] : '- Kosong -'}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-emerald-600">Kunci Jawaban:</span> {q.options[q.correctIndex]}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-900 text-sm mb-1">Penjelasan:</h4>
                    <p className="text-blue-800 text-sm">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="pt-4 flex justify-center">
          <Link
            href="/tryout"
            className="bg-white border border-slate-300 text-slate-700 px-8 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Home className="w-5 h-5" />
            Kembali ke Tryout
          </Link>
        </div>
      </div>
    </div>
  );
}
