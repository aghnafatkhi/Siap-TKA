'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DIAGNOSTIC_QUESTIONS, SUBJECTS, Question } from '@/lib/data';
import { useAppStore, DiagnosticResult } from '@/lib/store';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DiagnosticPage() {
  const router = useRouter();
  const { profile, progress, completeDiagnostic } = useAppStore();
  
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  // Filter questions based on mandatory subjects (wajib) + user's selected additional subjects
  const diagnosticQuestions = useMemo(() => {
    if (!profile) return DIAGNOSTIC_QUESTIONS;
    const requiredSubjectIds = SUBJECTS.filter(s => s.type === 'wajib').map(s => s.id);
    const selectedSubjectIds = profile.additionalSubjects || [];
    const validSubjectIds = [...requiredSubjectIds, ...selectedSubjectIds];
    
    // In a real app we'd fetch randomly from a large pool. For now, we filter what we have.
    // If we don't have enough questions for a subject, we just show what's available.
    return DIAGNOSTIC_QUESTIONS.filter(q => validSubjectIds.includes(q.subjectId));
  }, [profile]);

  useEffect(() => {
    if (!profile) {
      router.replace('/onboarding');
    }
  }, [profile, router]);

  const currentQuestion = diagnosticQuestions[currentIndex];
  
  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    if (currentIndex < diagnosticQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishDiagnostic();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishDiagnostic = () => {
    setFinished(true);
    const durationMinutes = Math.round((Date.now() - startTime) / 60000);
    
    let totalCorrect = 0;
    let totalIncorrect = 0;
    const subjectStats: Record<string, { correct: number; total: number }> = {};
    const competencyStats: Record<string, { correct: number; total: number }> = {};
    const wrongQuestions: string[] = [];
    const topicMistakes: Record<string, number> = {};

    diagnosticQuestions.forEach((q, idx) => {
      // Initialize stats
      if (!subjectStats[q.subjectId]) subjectStats[q.subjectId] = { correct: 0, total: 0 };
      if (!competencyStats[q.competencyId]) competencyStats[q.competencyId] = { correct: 0, total: 0 };

      subjectStats[q.subjectId].total++;
      competencyStats[q.competencyId].total++;

      if (answers[idx] === q.correctIndex) {
        totalCorrect++;
        subjectStats[q.subjectId].correct++;
        competencyStats[q.competencyId].correct++;
      } else {
        totalIncorrect++;
        wrongQuestions.push(q.id);
        topicMistakes[q.topic] = (topicMistakes[q.topic] || 0) + 1;
      }
    });

    const accuracyPerSubject: Record<string, number> = {};
    Object.keys(subjectStats).forEach(key => {
      accuracyPerSubject[key] = Math.round((subjectStats[key].correct / subjectStats[key].total) * 100);
    });

    const accuracyPerCompetency: Record<string, number> = {};
    Object.keys(competencyStats).forEach(key => {
      accuracyPerCompetency[key] = Math.round((competencyStats[key].correct / competencyStats[key].total) * 100);
    });

    // Sort prioritized topics by number of mistakes (descending)
    const prioritizedTopics = Object.entries(topicMistakes)
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic);

    const result: DiagnosticResult = {
      totalCorrect,
      totalIncorrect,
      accuracyPerSubject,
      accuracyPerCompetency,
      wrongQuestions,
      prioritizedTopics,
      durationMinutes: durationMinutes === 0 ? 1 : durationMinutes, // minimum 1 min
      date: new Date().toISOString()
    };

    setDiagnosticResult(result);
    completeDiagnostic(result);
  };

  if (!profile) return null;

  if (diagnosticQuestions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50 min-h-screen">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Soal Belum Tersedia</h2>
        <p className="text-slate-600 mb-6 max-w-md">Latihan diagnostik untuk kombinasi mata pelajaran yang kamu pilih saat ini masih dalam persiapan.</p>
        <button onClick={() => router.push('/')} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex flex-col justify-center min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto w-full px-6 py-12 text-center space-y-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Tes Diagnostik</h1>
          <p className="text-slate-600 text-lg">
            Ada {diagnosticQuestions.length} pertanyaan dari mata pelajaran wajib dan pilihanmu ({profile.additionalSubjects.map(sId => SUBJECTS.find(s => s.id === sId)?.name).join(', ') || 'Belum dipilih'}). 
            Kami akan memetakan kompetensimu. Santai saja, ini bukan ujian akhir.
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

  if (finished && diagnosticResult) {
    const primaryTopic = diagnosticResult.prioritizedTopics[0];
    const totalMistakesInPrimary = diagnosticQuestions.filter(q => q.topic === primaryTopic && diagnosticResult.wrongQuestions.includes(q.id)).length;

    return (
      <div className="flex-1 overflow-y-auto pb-24 md:pb-8 flex flex-col justify-center min-h-screen bg-slate-50">
        <div className="max-w-2xl mx-auto w-full px-6 py-12 text-center space-y-8">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tes Selesai!</h1>
            <p className="text-slate-600 text-lg">
              Kamu berhasil menjawab {diagnosticResult.totalCorrect} dari {diagnosticQuestions.length} pertanyaan dengan benar dalam waktu {diagnosticResult.durationMinutes} menit.
            </p>
          </div>
          
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm text-left space-y-6">
            <h3 className="font-bold text-xl text-slate-900 border-b pb-4">Ringkasan per Mata Pelajaran</h3>
            <div className="space-y-4">
              {Object.entries(diagnosticResult.accuracyPerSubject).map(([subId, acc]) => {
                const subName = SUBJECTS.find(s => s.id === subId)?.name || subId;
                return (
                  <div key={subId} className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{subName}</span>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${acc >= 70 ? 'bg-emerald-500' : acc >= 40 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${acc}%` }}></div>
                      </div>
                      <span className="font-bold text-slate-900 min-w-10 text-right">{acc}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-6 border-t">
              <h3 className="font-bold text-xl text-slate-900 mb-4">Rekomendasi Belajar</h3>
              {primaryTopic ? (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <p className="text-amber-800 font-medium">
                    Mulai dari <span className="font-bold">{primaryTopic}</span>. Kamu masih keliru pada {totalMistakesInPrimary} soal dari topik ini.
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-emerald-800 font-medium">
                    Kerja bagus! Penguasaan materimu cukup merata. Kamu bisa melanjutkan ke materi berikutnya secara berurutan.
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8 min-h-screen bg-slate-50 flex flex-col">
      <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-4 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-500">Soal {currentIndex + 1} / {diagnosticQuestions.length}</div>
        <div className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          {currentQuestion.subjectName}
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 mb-8 flex-1 flex flex-col">
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{currentQuestion.competencyName}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{currentQuestion.topic}</span>
          </div>

          {currentQuestion.stimulusType === 'text' && currentQuestion.stimulus && (
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                {currentQuestion.stimulus}
              </p>
            </div>
          )}

          <p className="text-lg text-slate-900 font-medium mb-8 leading-relaxed">
            {currentQuestion.question}
          </p>
          
          <div className="space-y-3 mt-auto">
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

        <div className="flex items-center justify-between">
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
            {currentIndex === diagnosticQuestions.length - 1 ? 'Selesaikan' : 'Berikutnya'}
            {currentIndex !== diagnosticQuestions.length - 1 && <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
