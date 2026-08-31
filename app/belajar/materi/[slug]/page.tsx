'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, CheckCircle2, MessageCircle, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { TOPICS } from '@/lib/data';
import { useAppStore } from '@/lib/store';

export default function SesiBelajar() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { completeLesson, logMistake } = useAppStore();

  const lessonData = useMemo(() => {
    let found = null;
    for (const subjectKey of Object.keys(TOPICS)) {
      const topic = TOPICS[subjectKey].find(t => t.id === slug);
      if (topic) {
        found = { ...topic };
        break;
      }
    }
    if (found && !found.example) {
      found.example = {
        question: `Contoh penerapan ${found.title}`,
        steps: [
          "Pahami konsep dasarnya.",
          "Gunakan rumus atau teori yang relevan.",
          "Dapatkan kesimpulan akhir."
        ]
      }
    }
    return found;
  }, [slug]);

  const [step, setStep] = useState(0); // 0: Materi, 1: Latihan, 2: Ringkasan
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Active time tracking
  const activeTimeMs = useRef(0);
  const lastActiveTimestamp = useRef(Date.now());
  const isTracking = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lastActiveTimestamp.current = Date.now();
        isTracking.current = true;
      } else {
        if (isTracking.current) {
          activeTimeMs.current += Date.now() - lastActiveTimestamp.current;
          isTracking.current = false;
        }
      }
    };

    const handleBlur = () => {
      if (isTracking.current) {
        activeTimeMs.current += Date.now() - lastActiveTimestamp.current;
        isTracking.current = false;
      }
    };

    const handleFocus = () => {
      if (!isTracking.current) {
        lastActiveTimestamp.current = Date.now();
        isTracking.current = true;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      if (isTracking.current) {
        activeTimeMs.current += Date.now() - lastActiveTimestamp.current;
      }
    };
  }, []);

  // Tutor AI state
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  if (!lessonData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-screen bg-slate-50">
        <div className="text-center p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Materi tidak ditemukan</h2>
          <p className="text-slate-500 mb-6">Materi yang kamu cari belum tersedia.</p>
          <Link href="/belajar" className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors">
            Kembali ke Daftar Belajar
          </Link>
        </div>
      </div>
    );
  }

  const question = lessonData.questions[currentQuestion];
  
  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === question.correctIndex;
    if (!isCorrect) {
      logMistake({
        lessonId: lessonData.id,
        subjectId: lessonData.subjectId,
        questionId: question.id,
        topicName: lessonData.title,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < lessonData.questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setStep(3); // Go to summary
      
      // Calculate minutes spent
      if (isTracking.current) {
        activeTimeMs.current += Date.now() - lastActiveTimestamp.current;
        lastActiveTimestamp.current = Date.now(); // reset for next tracking if needed
      }
      
      const minutesSpent = Math.max(1, Math.round(activeTimeMs.current / 60000));
      completeLesson(lessonData.id, minutesSpent);
    }
  };
  
  const askTutor = async () => {
    setIsTutorLoading(true);
    setTutorOpen(true);
    setTutorResponse(null);
    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: lessonData.subjectId,
          topic: lessonData.title,
          content: lessonData.content,
          question: step === 2 ? question.question : undefined,
          studentAnswer: step === 2 && selectedAnswer !== null ? question.options[selectedAnswer] : undefined,
          correctAnswer: step === 2 ? question.options[question.correctIndex] : undefined,
          isCorrect: step === 2 ? selectedAnswer === question.correctIndex : undefined,
          context: step === 2 ? 'Latihan Soal' : 'Penjelasan Materi',
        })
      });
      const data = await res.json();
      setTutorResponse(data);
    } catch (e) {
      setTutorResponse({ error: 'Gagal menghubungi tutor. Coba lagi.' });
    }
    setIsTutorLoading(false);
  };

  return (
    <div className="flex flex-col h-full min-h-screen bg-slate-50 relative">
      {/* Header */}
      <header className="border-b border-slate-200 px-4 h-16 flex items-center justify-between shrink-0 sticky top-0 bg-white z-10">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-slate-900 truncate mx-4">
          {lessonData.title}
        </span>
        <div className="w-9" /> {/* Spacer for centering */}
      </header>
      
      {/* Progress Bar */}
      <div className="h-1 bg-slate-200 w-full shrink-0">
        <div 
          className="h-full bg-blue-500 transition-all duration-300" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
        
        {/* Step 0: Penjelasan Materi */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest uppercase rounded-full">
              Materi
            </span>
            <div className="prose prose-slate prose-blue max-w-none text-slate-700 whitespace-pre-wrap">
              {lessonData.content}
            </div>
            <div className="pt-8">
              <button 
                onClick={() => setStep(1)}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white p-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mx-auto"
              >
                Lihat Contoh
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Contoh */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold tracking-widest uppercase rounded-full">
              Contoh
            </span>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-900 text-lg">
              {lessonData.example.question}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Cara pengerjaan:</h3>
              <ol className="space-y-4">
                {lessonData.example.steps.map((s: string, i: number) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-slate-700 mt-1">{s}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => setStep(2)}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white p-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mx-auto"
              >
                Mulai Latihan
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Latihan */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold tracking-widest uppercase rounded-full">
                Latihan {currentQuestion + 1} / {lessonData.questions.length}
              </span>
            </div>
            
            <h2 className="text-xl font-medium text-slate-900 leading-relaxed">
              {question.question}
            </h2>

            <div className="space-y-3 pt-4">
              {question.options.map((opt: string, idx: number) => {
                const isSelected = selectedAnswer === idx;
                const isCorrect = idx === question.correctIndex;
                const showStatus = showExplanation;
                
                let btnStyle = "border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50 text-slate-700 hover:shadow-md";
                if (showStatus) {
                  if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500 shadow-sm";
                  else if (isSelected && !isCorrect) btnStyle = "border-rose-300 bg-rose-50 text-rose-900";
                  else btnStyle = "border-slate-200 bg-slate-50 text-slate-400 opacity-50";
                } else if (isSelected) {
                  btnStyle = "border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-sm";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4 pt-4">
                <div className={`p-4 rounded-xl border ${selectedAnswer === question.correctIndex ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    {selectedAnswer === question.correctIndex ? (
                      <><CheckCircle2 className="w-5 h-5 text-emerald-600"/> Tepat sekali!</>
                    ) : (
                      <><AlertCircle className="w-5 h-5 text-rose-600"/> Belum tepat</>
                    )}
                  </h3>
                  <p className="text-sm opacity-90">{question.explanation}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={askTutor}
                    className="flex-1 bg-white border border-slate-300 text-slate-700 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Jelaskan lebih detail
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Lanjut
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Ringkasan */}
        {step === 3 && (
          <div className="space-y-6 text-center animate-in zoom-in-95 duration-500 py-12">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Belajar hari ini selesai!</h1>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left my-8">
              <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-3">Ringkasan</h3>
              <p className="text-slate-800">{lessonData.summary}</p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              <Link
                href="/belajar"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 block"
              >
                Sudah paham, kembali ke Belajar
              </Link>
              <button
                onClick={askTutor}
                className="w-full bg-white border border-slate-300 text-slate-700 p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
              >
                Ada yang masih membingungkan
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tutor AI Modal Sheet Overlay */}
      {tutorOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setTutorOpen(false)} />
          <div className="bg-white rounded-t-3xl shadow-xl border-t border-slate-200 p-6 relative z-10 w-full max-w-3xl mx-auto h-[80%] flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0" />
            
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Tutor AI</h3>
                <p className="text-xs text-slate-500">Membantu menjelaskan materi</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto prose prose-slate max-w-none text-slate-700 pb-safe">
              {isTutorLoading ? (
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2">Tutor sedang berpikir...</span>
                </div>
              ) : tutorResponse?.error ? (
                <div className="bg-rose-50 text-rose-700 p-4 rounded-xl font-medium">
                  {tutorResponse.error}
                </div>
              ) : tutorResponse ? (
                <div className="space-y-4">
                  {tutorResponse.status === 'salah' && (
                    <div className="bg-rose-50 text-rose-900 p-3 rounded-lg border border-rose-200 font-medium">
                      Perhatikan: {tutorResponse.letak_kesalahan}
                    </div>
                  )}
                  {tutorResponse.petunjuk && (
                    <div className="bg-blue-50 text-blue-900 p-4 rounded-xl border border-blue-100">
                      <strong>Petunjuk:</strong> {tutorResponse.petunjuk}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2">Penjelasan:</h4>
                    <p className="whitespace-pre-wrap">{tutorResponse.penjelasan}</p>
                  </div>
                  {tutorResponse.rekomendasi_berikutnya && (
                    <div className="mt-6 text-sm text-slate-500 border-t border-slate-100 pt-4">
                      <strong>Saran selanjutnya:</strong> {tutorResponse.rekomendasi_berikutnya}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="pt-4 shrink-0 mt-4 border-t border-slate-100">
              <button
                onClick={() => setTutorOpen(false)}
                className="w-full bg-slate-100 text-slate-700 p-4 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Tutup Tutor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
