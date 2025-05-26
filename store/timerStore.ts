import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerState, StudySession } from '~/types/timer';

const MAX_DURATION = 7200; // 2 hours in seconds

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      duration: 1500, // Default 25 minutes
      timeRemaining: 1500,
      isRunning: false,
      isPaused: false,
      sessions: [],

      setDuration: (duration) => {
        const validDuration = Math.min(duration, MAX_DURATION);
        set({ 
          duration: validDuration,
          timeRemaining: validDuration
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
        const newSession: StudySession = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          duration: get().duration - get().timeRemaining,
          completed,
        };

        set(state => ({
          sessions: [...state.sessions, newSession],
          timeRemaining: state.duration,
          isRunning: false,
          isPaused: false,
        }));
      },
    }),
    {
      name: 'study-timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useTimerStore;