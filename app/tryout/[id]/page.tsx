'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle2, PlayCircle, Clock } from 'lucide-react';
import { TRYOUTS } from '@/lib/data';
import { useAppStore } from '@/lib/store';

export default function TryoutRun() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { completeTryout } = useAppStore();

  const tryout = useMemo(() => TRYOUTS.find(t => t.id === id), [id]);
  
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(tryout ? tryout.durationMinutes * 60 : 0);

  const submitTryout = useCallback((force = false) => {
    if (!tryout) return;
    if (!force) {
      const isConfirmed = confirm('Apakah kamu yakin ingin mengakhiri tryout ini?');
      if (!isConfirmed) return;
    }

    let correct = 0;
    tryout.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const score = Math.round((correct / tryout.questions.length) * 1000);

    const result = {
      id: tryout.id,
      score,
      correct,
      total: tryout.questions.length,
      answers
    };

    completeTryout(result);
    localStorage.setItem(`temp_hasil_${tryout.id}`, JSON.stringify(result));
    router.replace(`/tryout/${tryout.id}/hasil`);
  }, [answers, completeTryout, router, tryout]);

  useEffect(() => {
    let timer: any;
    if (started && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitTryout(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, timeLeft, submitTryout]);

  if (!tryout) {
    return <div className="p-8 text-center">Memuat tryout...</div>;
  }

  if (!started) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex flex-col justify-center min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto w-full px-6 py-12 text-center space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <PlayCircle className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{tryout.title}</h1>
          <p className="text-slate-600 text-lg">
            {tryout.description}
          </p>
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left mb-8">
            <ul className="space-y-3 font-medium text-slate-700">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Jumlah Soal: {tryout.questions.length} Butir
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Durasi: {tryout.durationMinutes} Menit
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Dapat mengubah jawaban sebelum waktu habis.
              </li>
            </ul>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="w-full bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = tryout.questions[currentIndex];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex-1 overflow-y-auto min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-500">Soal {currentIndex + 1} / {tryout.questions.length}</div>
        <div className="text-sm font-bold text-rose-600 flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
          <Clock className="w-4 h-4" />
          {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Main Question Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-6 flex-1">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest uppercase rounded-full mb-4">
              {currentQuestion.subject}
            </span>
            <p className="text-lg text-slate-900 font-medium mb-8 leading-relaxed">
              {currentQuestion.question}
            </p>
            
            <div className="space-y-3">
              {currentQuestion.options.map((opt: string, idx: number) => {
                const isSelected = answers[currentIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentIndex]: idx }))}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-sm font-bold' 
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="mr-3">{String.fromCharCode(65 + idx)}.</span> {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Sebelumnya
            </button>
            
            <button
              onClick={() => setCurrentIndex(prev => Math.min(tryout.questions.length - 1, prev + 1))}
              disabled={currentIndex === tryout.questions.length - 1}
              className="bg-slate-200 text-slate-700 hover:bg-slate-300 px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-30"
            >
              Berikutnya
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-max">
          <h3 className="font-bold text-slate-900 mb-4">Navigasi Soal</h3>
          <div className="grid grid-cols-5 gap-2 mb-8">
            {tryout.questions.map((_: any, i: number) => {
              const answered = answers[i] !== undefined;
              const active = currentIndex === i;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                    active ? 'ring-2 ring-blue-500 bg-blue-50 text-blue-700' :
                    answered ? 'bg-blue-500 text-white shadow-sm' :
                    'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => submitTryout(false)}
            className="w-full bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Akhiri Tryout
          </button>
        </div>
      </div>
    </div>
  );
}
