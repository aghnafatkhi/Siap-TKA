import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  additionalSubjects: string[];
  dailyStudyTime: number; // in minutes
  targetDate: string; // ISO date string
  onboardingCompleted: boolean;
}

export interface ProgressState {
  dailyProgressMinutes: number;
  lastStudyDate: string;
}

interface AppState {
  profile: UserProfile | null;
  progress: ProgressState;
  setProfile: (profile: UserProfile) => void;
  updateProgress: (minutes: number) => void;
  resetDailyProgressIfNeeded: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      progress: {
        dailyProgressMinutes: 0,
        lastStudyDate: new Date().toISOString().split('T')[0],
      },
      setProfile: (profile) => set({ profile }),
      updateProgress: (minutes) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          progress: {
            ...state.progress,
            dailyProgressMinutes: state.progress.lastStudyDate === today
              ? state.progress.dailyProgressMinutes + minutes
              : minutes,
            lastStudyDate: today,
          }
        }));
      },
      resetDailyProgressIfNeeded: () => {
        const today = new Date().toISOString().split('T')[0];
        const { progress } = get();
        if (progress.lastStudyDate !== today) {
          set({
            progress: {
              ...progress,
              dailyProgressMinutes: 0,
              lastStudyDate: today,
            }
          });
        }
      }
    }),
    {
      name: 'siap-tka-storage',
    }
  )
);
