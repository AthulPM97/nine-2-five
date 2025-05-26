import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerState, StudySession, DailyProgress } from '~/types/timer';

const MAX_DURATION = 7200; // 2 hours in seconds
const MIN_DAILY_TARGET = 4 * 60 * 60; // 4 hours in seconds
const MAX_DAILY_TARGET = 9 * 60 * 60; // 9 hours in seconds

// Helper to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      duration: 1500, // Default 25 minutes
      timeRemaining: 1500,
      isRunning: false,
      isPaused: false,
      sessions: [],
      dailyTarget: 4 * 60 * 60, // Default 4 hours
      dailyProgress: [],

      setDuration: (duration) => {
        const validDuration = Math.min(duration, MAX_DURATION);
        set({
          duration: validDuration,
          timeRemaining: validDuration,
        });
      },

      startTimer: () => {
        set({
          isRunning: true,
          isPaused: false,
        });
      },

      pauseTimer: () => {
        set({
          isRunning: false,
          isPaused: true,
        });
      },

      resumeTimer: () => {
        set({
          isRunning: true,
          isPaused: false,
        });
      },

      resetTimer: () => {
        set({
          timeRemaining: get().duration,
          isRunning: false,
          isPaused: false,
        });
      },

      completeSession: (completed) => {
        const sessionDuration = get().duration - get().timeRemaining;
        const newSession: StudySession = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          duration: sessionDuration,
          completed,
        };

        // Update daily progress
        const today = getTodayDateString();
        const currentProgress = get().dailyProgress;
        const todayProgressIndex = currentProgress.findIndex((p) => p.date === today);

        let updatedProgress = [...currentProgress];

        if (todayProgressIndex >= 0) {
          // Update existing progress for today
          updatedProgress[todayProgressIndex] = {
            ...updatedProgress[todayProgressIndex],
            totalSeconds: updatedProgress[todayProgressIndex].totalSeconds + sessionDuration,
          };
        } else {
          // Add new progress entry for today
          updatedProgress.push({
            date: today,
            totalSeconds: sessionDuration,
          });
        }

        set((state) => ({
          sessions: [...state.sessions, newSession],
          dailyProgress: updatedProgress,
          timeRemaining: state.duration,
          isRunning: false,
          isPaused: false,
        }));
      },

      setDailyTarget: (hours) => {
        // Convert hours to seconds and validate
        const targetInSeconds = Math.max(
          MIN_DAILY_TARGET,
          Math.min(hours * 60 * 60, MAX_DAILY_TARGET)
        );

        set({ dailyTarget: targetInSeconds });
      },
    }),
    {
      name: 'study-timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTimerStore;
