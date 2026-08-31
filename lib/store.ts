import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  additionalSubjects: string[];
  dailyStudyTime: number; // in minutes
  targetDate: string; // ISO date string
  onboardingCompleted: boolean;
}

export interface MistakeLog {
  lessonId: string;
  subjectId: string;
  questionId: string;
  topicName: string;
  timestamp: string;
}

export interface ProgressState {
  dailyProgressMinutes: number;
  lastStudyDate: string;
  diagnosticCompleted: boolean;
  completedLessons: string[];
  mistakes: MistakeLog[];
  streakDays: number;
  tryoutHistory: any[];
}

interface AppState {
  profile: UserProfile | null;
  progress: ProgressState;
  setProfile: (profile: UserProfile) => void;
  updateProgress: (minutes: number) => void;
  resetDailyProgressIfNeeded: () => void;
  completeDiagnostic: () => void;
  completeLesson: (lessonId: string, minutesSpent: number) => void;
  logMistake: (mistake: Omit<MistakeLog, 'timestamp'>) => void;
  completeTryout: (result: any) => void;
  resetApp: () => void;
}

const defaultProgress: ProgressState = {
  dailyProgressMinutes: 0,
  lastStudyDate: new Date().toISOString().split('T')[0],
  diagnosticCompleted: false,
  completedLessons: [],
  mistakes: [],
  streakDays: 0,
  tryoutHistory: []
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: defaultProgress,
      setProfile: (profile) => set({ profile }),
      updateProgress: (minutes) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          let newStreak = state.progress.streakDays;
          if (state.progress.lastStudyDate !== today) {
            // Check if last study date was exactly yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (state.progress.lastStudyDate === yesterdayStr) {
              newStreak += 1;
            } else if (state.progress.lastStudyDate < yesterdayStr) {
              newStreak = 1; // Reset streak if missed a day, but this is the first study of the day
            }
          }

          return {
            progress: {
              ...state.progress,
              dailyProgressMinutes: state.progress.lastStudyDate === today
                ? state.progress.dailyProgressMinutes + minutes
                : minutes,
              lastStudyDate: today,
              streakDays: newStreak === 0 && minutes > 0 ? 1 : newStreak
            }
          };
        });
      },
      resetDailyProgressIfNeeded: () => {
        const today = new Date().toISOString().split('T')[0];
        const { progress } = get();
        if (progress.lastStudyDate !== today) {
          set({
            progress: {
              ...progress,
              dailyProgressMinutes: 0,
              // We don't update lastStudyDate here until they actually study
            }
          });
        }
      },
      completeDiagnostic: () => set((state) => ({
        progress: { ...state.progress, diagnosticCompleted: true }
      })),
      completeLesson: (lessonId, minutesSpent) => {
        get().updateProgress(minutesSpent);
        set((state) => ({
          progress: {
            ...state.progress,
            completedLessons: state.progress.completedLessons.includes(lessonId) 
              ? state.progress.completedLessons 
              : [...state.progress.completedLessons, lessonId]
          }
        }));
      },
      logMistake: (mistake) => set((state) => ({
        progress: {
          ...state.progress,
          mistakes: [
            ...state.progress.mistakes, 
            { ...mistake, timestamp: new Date().toISOString() }
          ]
        }
      })),
      completeTryout: (result) => set((state) => ({
        progress: {
          ...state.progress,
          tryoutHistory: [...state.progress.tryoutHistory, { ...result, date: new Date().toISOString() }]
        }
      })),
      resetApp: () => set({ profile: null, progress: defaultProgress }),
    }),
    {
      name: 'siap-tka-storage',
    }
  )
);
