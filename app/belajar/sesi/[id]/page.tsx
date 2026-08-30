'use client';

import { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// Mock data: Contoh materi resmi
const LESSON_DATA = {
  id: 'matematika-peluang-1',
  subject: 'Matematika',
  topic: 'Peluang',
  competency: 'Menentukan peluang suatu kejadian',
  title: 'Konsep Dasar Peluang',
  content: `Peluang adalah nilai kemungkinan terjadinya suatu kejadian. Nilainya berada di antara 0 (mustahil) dan 1 (pasti terjadi).

Rumus dasar peluang kejadian A, ditulis P(A), adalah:
P(A) = n(A) / n(S)

Keterangan:
- n(A) = banyaknya kejadian A yang diharapkan
- n(S) = total semua kemungkinan (ruang sampel)`,
  example: {
    question: 'Berapa peluang munculnya angka genap saat kita melempar satu buah dadu bersisi 6?',
    steps: [
      'Tentukan ruang sampel n(S). Dadu punya 6 sisi (1, 2, 3, 4, 5, 6), jadi n(S) = 6.',
      'Tentukan kejadian yang diharapkan n(A). Angka genap adalah 2, 4, dan 6. Ada 3 angka, jadi n(A) = 3.',
      'Hitung peluangnya: P(A) = n(A) / n(S) = 3 / 6 = 1/2.'
    ]
  },
  questions: [
    {
      id: 'q1',
      text: 'Jika kita melempar sebuah koin, berapa peluang munculnya sisi Angka?',
      options: ['1/4', '1/3', '1/2', '1'],
      correctIndex: 2,
      explanation: 'Koin memiliki 2 sisi (Angka dan Gambar). n(S) = 2. Sisi angka hanya 1, n(A) = 1. Jadi peluangnya 1/2.'
    },
    {
      id: 'q2',
      text: 'Dalam sebuah kantong terdapat 3 kelereng merah dan 2 kelereng biru. Berapa peluang terambilnya kelereng biru?',
      options: ['2/5', '3/5', '1/2', '2/3'],
      correctIndex: 0,
      explanation: 'Total kelereng n(S) = 3 + 2 = 5. Kelereng biru n(A) = 2. Peluangnya 2/5.'
    }
  ],
  summary: 'Peluang dihitung dengan membagi jumlah kejadian yang kita harapkan dengan total semua kemungkinan yang ada.'
};

export default function SesiBelajar() {
  const [step, setStep] = useState(0); // 0: Materi, 1: Contoh, 2: Latihan, 3: Ringkasan
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]); // true if correct
  
  // Tutor AI state
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isTutorLoading, setIsTutorLoading] = useState(false);
  
  const question = LESSON_DATA.questions[currentQuestion];
  
  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    const isCorrect = index === question.correctIndex;
    const newStatus = [...answersStatus];
    newStatus[currentQuestion] = isCorrect;
    setAnswersStatus(newStatus);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < LESSON_DATA.questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setStep(3); // Go to summary
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
          subject: LESSON_DATA.subject,
          topic: LESSON_DATA.topic,
          content: LESSON_DATA.content,
          question: step === 2 ? question.text : undefined,
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
    <div className="flex flex-col h-full bg-white relative">
      {/* Header */}
      <header className="border-b border-slate-200 px-4 h-16 flex items-center justify-between shrink-0 sticky top-0 bg-white z-10">
        <Link href="/belajar" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <span className="font-semibold text-slate-900 truncate mx-4">
          {LESSON_DATA.title}
        </span>
        <div className="w-9" /> {/* Spacer for centering */}
      </header>
      
      {/* Progress Bar */}
      <div className="h-1 bg-slate-100 w-full shrink-0">
        <div 
          className="h-full bg-blue-600 transition-all duration-300" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
        
        {/* Step 0: Penjelasan Materi */}
        {step === 0 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold tracking-widest uppercase rounded-full">
              Materi
            </span>
            <div className="prose prose-slate prose-blue max-w-none text-slate-700 whitespace-pre-wrap">
              {LESSON_DATA.content}
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold tracking-widest uppercase rounded-full">
              Contoh
            </span>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-slate-900 text-lg">
              {LESSON_DATA.example.question}
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Cara pengerjaan:</h3>
              <ol className="space-y-4">
                {LESSON_DATA.example.steps.map((s, i) => (
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
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold tracking-widest uppercase rounded-full">
                Latihan {currentQuestion + 1} / {LESSON_DATA.questions.length}
              </span>
            </div>
            
            <h2 className="text-xl font-medium text-slate-900 leading-relaxed">
              {question.text}
            </h2>

            <div className="space-y-3 pt-4">
              {question.options.map((opt, idx) => {
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
                <div className={`p-4 rounded-xl border ${selectedAnswer === question.correctIndex ? 'bg-green-50 border-green-200 text-green-900' : 'bg-amber-50 border-amber-200 text-amber-900'}`}>
                  <h3 className="font-bold mb-1 flex items-center gap-2">
                    {selectedAnswer === question.correctIndex ? (
                      <><CheckCircle2 className="w-5 h-5 text-green-600"/> Tepat sekali!</>
                    ) : (
                      <><AlertCircle className="w-5 h-5 text-amber-600"/> Belum tepat</>
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
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Belajar hari ini selesai!</h1>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left my-8">
              <h3 className="text-sm font-bold tracking-wider text-slate-500 uppercase mb-3">Ringkasan</h3>
              <p className="text-slate-800">{LESSON_DATA.summary}</p>
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
              <Link
                href="/"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/20"
              >
                Sudah paham, kembali
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
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2">Tutor sedang berpikir...</span>
                </div>
              ) : tutorResponse?.error ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl">
                  {tutorResponse.error}
                </div>
              ) : tutorResponse ? (
                <div className="space-y-4">
                  {tutorResponse.status === 'salah' && (
                    <div className="bg-amber-50 text-amber-900 p-3 rounded-lg border border-amber-200 font-medium">
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
                    <div className="mt-6 text-sm text-slate-500 border-t pt-4">
                      <strong>Saran selanjutnya:</strong> {tutorResponse.rekomendasi_berikutnya}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="pt-4 shrink-0 mt-4 border-t border-slate-100">
              <button
                onClick={() => setTutorOpen(false)}
                className="w-full bg-slate-100 text-slate-700 p-4 rounded-xl font-medium hover:bg-slate-200 transition-colors"
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
