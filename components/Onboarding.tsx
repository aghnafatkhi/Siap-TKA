'use client';

import { useState } from 'react';
import { useAppStore, UserProfile } from '@/lib/store';
import { ChevronRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ADDITIONAL_SUBJECTS = [
  'Matematika Tingkat Lanjut',
  'Fisika',
  'Kimia',
  'Biologi',
  'Ekonomi',
  'Sosiologi',
  'Geografi',
  'Sejarah',
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [dailyTime, setDailyTime] = useState<number>(30);
  const [targetDate, setTargetDate] = useState<string>('');
  
  const setProfile = useAppStore((state) => state.setProfile);
  const completeDiagnostic = useAppStore((state) => state.completeDiagnostic);
  const router = useRouter();

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const finishOnboarding = (skipDiagnostic: boolean) => {
    const profile: UserProfile = {
      name,
      additionalSubjects: selectedSubjects,
      dailyStudyTime: dailyTime,
      targetDate,
      onboardingCompleted: true,
    };
    setProfile(profile);

    if (skipDiagnostic) {
      completeDiagnostic();
      router.push('/');
    } else {
      router.push('/diagnostik');
    }
  };

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else if (selectedSubjects.length < 2) {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12 md:py-24 max-w-xl mx-auto w-full">
      <div className="flex-1 flex flex-col justify-center">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Halo! Siapa namamu?</h1>
              <p className="text-slate-600">Kita akan menyiapkan rencana belajarmu.</p>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama panggilan"
              className="w-full p-4 border border-slate-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
            />
            <button
              onClick={handleNext}
              disabled={!name.trim()}
              className="w-full bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600"
            >
              Lanjut
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Pilih 2 mata pelajaran tambahan</h1>
              <p className="text-slate-600">Bahasa Indonesia, Matematika, dan Bahasa Inggris sudah otomatis terpilih sebagai pelajaran wajib.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ADDITIONAL_SUBJECTS.map((subject) => {
                const isSelected = selectedSubjects.includes(subject);
                const isDisabled = !isSelected && selectedSubjects.length >= 2;
                return (
                  <button
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    disabled={isDisabled}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-bold">{subject}</span>
                    {isSelected && <Check className="h-5 w-5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              disabled={selectedSubjects.length !== 2}
              className="w-full bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600 mt-4"
            >
              Lanjut
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Target waktu belajar harian</h1>
              <p className="text-slate-600">Berapa lama kamu ingin belajar setiap hari?</p>
            </div>
            <div className="space-y-3">
              {[15, 30, 60].map((time) => (
                <button
                  key={time}
                  onClick={() => setDailyTime(time)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    dailyTime === time
                      ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-sm font-medium'
                  }`}
                >
                  {time} menit / hari
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600 mt-4"
            >
              Lanjut
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Kapan ujian TKA kamu?</h1>
              <p className="text-slate-600">Pilih estimasi tanggal ujian untuk menghitung sisa waktu belajar.</p>
            </div>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full p-4 border border-slate-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
            <button
              onClick={handleNext}
              disabled={!targetDate}
              className="w-full bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600"
            >
              Lanjut
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 text-center">
            <div className="h-20 w-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Pengaturan selesai!</h1>
            <p className="text-slate-600">
              Sistem telah menyusun rencana belajarmu. Mari kerjakan beberapa soal diagnostik singkat untuk mengetahui tingkat kemampuanmu, atau kamu bisa langsung mulai belajar.
            </p>
            <div className="pt-6 space-y-4">
              <button
                onClick={() => finishOnboarding(false)}
                className="w-full bg-blue-500 text-white p-4 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg shadow-blue-500/20 hover:bg-blue-600"
              >
                Mulai Tes Diagnostik
              </button>
              <button
                onClick={() => finishOnboarding(true)}
                className="w-full bg-white text-slate-700 p-4 rounded-xl border border-slate-300 font-bold flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
              >
                Lewati, langsung belajar
              </button>
            </div>
          </div>
        )}
      </div>
      
      {step < 5 && (
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
