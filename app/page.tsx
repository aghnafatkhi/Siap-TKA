'use client';

import { useAppStore } from '@/lib/store';
import { calculateDaysRemaining } from '@/lib/utils';
import { ChevronRight, Target, Clock, BookOpen, AlertCircle, FileEdit } from 'lucide-react';
import Link from 'next/link';
import { SUBJECTS, TOPICS } from '@/lib/data';

export default function HariIni() {
  const { profile, progress } = useAppStore();

  if (!profile) return null;

  const daysRemaining = calculateDaysRemaining(profile.targetDate) || 0;

  const progressPercentage = Math.min(
    Math.round((progress.dailyProgressMinutes / profile.dailyStudyTime) * 100),
    100
  );

  // Determine what to recommend
  let recommendTitle = "Rekomendasi Belajar";
  let recommendText = "Belajar atau latihan dulu untuk melihat bagian yang perlu diperbaiki.";
  let recommendLink = "/belajar";
  let recommendBtnText = "Mulai Belajar Sekarang";
  let showDiagnosticPrompt = !progress.diagnosticCompleted;

  if (showDiagnosticPrompt) {
    recommendTitle = "Lakukan Tes Diagnostik";
    recommendText = "Ikuti tes diagnostik awal agar kami bisa menyesuaikan rekomendasi belajar khusus untukmu.";
    recommendLink = "/diagnostik";
    recommendBtnText = "Ikuti Tes Diagnostik";
  } else if (progress.diagnosticResult && progress.diagnosticResult.prioritizedTopics.length > 0) {
    // Find the first topic from prioritized topics that hasn't been fully completed
    const priorityTopicTitle = progress.diagnosticResult.prioritizedTopics[0];
    recommendText = `Berdasarkan tes terakhir, kamu perlu memperkuat materi ${priorityTopicTitle}.`;
    
    // Find matching topic in TOPICS to get the link
    let foundId = '';
    for (const sub of Object.keys(TOPICS)) {
      const found = TOPICS[sub].find(t => t.title === priorityTopicTitle || t.topic === priorityTopicTitle);
      if (found) {
        foundId = found.id;
        break;
      }
    }
    
    if (foundId) {
      recommendLink = `/belajar/materi/${foundId}`;
      recommendBtnText = `Pelajari Materi`;
    }
  } else if ((progress.mistakes || []).length > 0) {
    // Group mistakes by topic for recommendations (fallback if no specific diagnostic priorities)
    const mistakesByTopic = (progress.mistakes || []).reduce((acc, m) => {
      if (!acc[m.topicName]) {
        acc[m.topicName] = { lessonId: m.lessonId, count: 0 };
      }
      acc[m.topicName].count += 1;
      return acc;
    }, {} as Record<string, { lessonId: string, count: number }>);

    const topMistakes = Object.entries(mistakesByTopic)
      .sort((a, b) => b[1].count - a[1].count);

    if (topMistakes.length > 0) {
      recommendText = `Kamu sering keliru di materi ${topMistakes[0][0]}. Sebaiknya ulangi materi ini.`;
      recommendLink = `/belajar/materi/${topMistakes[0][1].lessonId}`;
      recommendBtnText = "Ulangi Materi";
    }
  }

  return (
    <div className="flex-1 overflow-y-auto pb-24 md:pb-8">
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 space-y-6">
        
        {/* Header Section */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-lg">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium mb-4">Siap TKA</span>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Halo, {profile.name} 👋
            </h1>
            <p className="text-white/70 mb-6">
              Ada <span className="font-bold text-white">{daysRemaining} hari</span> lagi menuju ujian TKA-mu. Fokus hari ini: capai target belajarmu.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-8 hidden sm:block">
            <Target className="w-32 h-32 text-white/5" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {/* Daily Target Section */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-500 uppercase">Target Belajar Hari Ini</h2>
                <div className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-3 py-1 rounded-lg text-xs">
                  <Clock className="w-4 h-4" />
                  {progress.dailyProgressMinutes} / {profile.dailyStudyTime} mnt
                </div>
              </div>
              
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <Link
                href={recommendLink}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20"
              >
                {recommendBtnText}
                <ChevronRight className="w-5 h-5" />
              </Link>
            </section>

            {/* Needs Improvement Section */}
            <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                {recommendTitle}
              </h2>
              
              <div className="flex items-start p-4 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  {showDiagnosticPrompt ? <FileEdit className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed">{recommendText}</p>
                </div>
              </div>
            </section>
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            {/* Next Schedule Section */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-500 uppercase mb-4">Fokus Mata Pelajaran</h2>
              <div className="relative space-y-6">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                <div className="relative flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">Bahasa Indonesia</p>
                    <p className="text-xs text-slate-500 mt-1">Wajib</p>
                  </div>
                </div>
                {profile.additionalSubjects.map((subjectId, idx) => {
                  const subjectName = SUBJECTS.find(s => s.id === subjectId)?.name || subjectId;
                  return (
                    <div key={subjectId} className="relative flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 z-10">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{subjectName}</p>
                        <p className="text-xs text-slate-500 mt-1">Pilihan {idx + 1}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-lg shadow-emerald-600/10">
              <p className="text-xs font-medium text-emerald-100 mb-1">Statistik Belajar</p>
              <p className="text-2xl font-bold">{progress.streakDays} Hari Berturut-turut</p>
              {progress.streakDays > 0 ? (
                <p className="text-[10px] mt-2 opacity-80 uppercase tracking-widest font-bold flex items-center gap-1">
                  <span>🔥</span> Pertahankan Semangatmu!
                </p>
              ) : (
                <p className="text-[10px] mt-2 opacity-80 uppercase font-bold flex items-center gap-1">
                  Selesaikan satu materi untuk memulai streak.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
