'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DIAGNOSTIC_QUESTIONS } from '@/lib/data';
import { useAppStore } from '@/lib/store';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function DiagnosticPage() {
  const router = useRouter();
  const completeDiagnostic = useAppStore(state => state.completeDiagnostic);
  
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  const currentQuestion = DIAGNOSTIC_QUESTIONS[currentIndex];
  
  const handleStart = () => setStarted(true);

  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
      completeDiagnostic();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  if (!started) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex flex-col justify-center min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto w-full px-6 py-12 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tes Diagnostik</h1>
          <p className="text-slate-600 text-lg">
            Ada {DIAGNOSTIC_QUESTIONS.length} pertanyaan singkat untuk memetakan kemampuan awalmu. 
            Santai saja, ini bukan ujian akhir.
          </p>
          <button
            onClick={handleStart}
            className="w-full sm:w-auto bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600 mx-auto block"
          >
            Mulai Sekarang
          </button>
        </div>
      </div>
    );
  }

  if (finished) {
    const score = calculateScore();
    return (
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex flex-col justify-center min-h-screen bg-slate-50">
        <div className="max-w-xl mx-auto w-full px-6 py-12 text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tes Selesai!</h1>
            <p className="text-slate-600 text-lg">
              Kamu berhasil menjawab {score} dari {DIAGNOSTIC_QUESTIONS.length} pertanyaan dengan benar.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-left">
            <h3 className="font-bold text-slate-900 mb-2">Rekomendasi Awal</h3>
            <p className="text-slate-600">Berdasarkan hasil ini, kami telah menyusun prioritas materi yang perlu kamu kuasai terlebih dahulu. Rencana ini akan terus disesuaikan seiring perkembanganmu.</p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600"
          >
            Mulai Belajar di Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-500">Soal {currentIndex + 1} / {DIAGNOSTIC_QUESTIONS.length}</div>
        <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {currentQuestion.subject}
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 flex-1">
          <p className="text-lg text-slate-900 font-medium mb-8 leading-relaxed">
            {currentQuestion.question}
          </p>
          
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentIndex] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span> {opt}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 transition-all flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Sebelumnya
          </button>
          
          <button
            onClick={handleNext}
            disabled={answers[currentIndex] === undefined}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:shadow-none shadow-lg shadow-blue-500/20"
          >
            {currentIndex === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Selesaikan' : 'Berikutnya'}
            {currentIndex !== DIAGNOSTIC_QUESTIONS.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
