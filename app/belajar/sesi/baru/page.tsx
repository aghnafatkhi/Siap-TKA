'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { TOPICS } from '@/lib/data';

export default function SesiBaruRouter() {
  const router = useRouter();
  const { progress } = useAppStore();

  useEffect(() => {
    // Basic recommendation logic
    // 1. If there are mistakes, prioritize the most frequent mistake topic
    if (progress.mistakes.length > 0) {
      const mistakesByTopic = progress.mistakes.reduce((acc, m) => {
        if (!acc[m.topicName]) {
          acc[m.topicName] = { lessonId: m.lessonId, count: 0 };
        }
        acc[m.topicName].count += 1;
        return acc;
      }, {} as Record<string, { lessonId: string, count: number }>);

      const topMistake = Object.entries(mistakesByTopic)
        .sort((a, b) => b[1].count - a[1].count)[0];
        
      if (topMistake) {
        router.replace(`/belajar/sesi/${topMistake[1].lessonId}`);
        return;
      }
    }

    // 2. Otherwise find the first uncompleted lesson across all topics
    for (const subjectKey of Object.keys(TOPICS)) {
      for (const lesson of TOPICS[subjectKey]) {
        if (!progress.completedLessons.includes(lesson.id)) {
          router.replace(`/belajar/sesi/${lesson.id}`);
          return;
        }
      }
    }

    // 3. Fallback to learning dashboard if all complete
    router.replace('/belajar');
  }, [progress, router]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Mencari materi terbaik untukmu...</p>
      </div>
    </div>
  );
}
