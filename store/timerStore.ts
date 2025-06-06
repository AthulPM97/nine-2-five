import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerState, StudySession } from '~/types/timer';
import { Platform } from 'react-native';
import { MAX_DURATION, MIN_DAILY_TARGET, MAX_DAILY_TARGET } from './timerConstants';
import {
  defineBackgroundTask,
  registerBackgroundTask,
  unregisterBackgroundTask,
} from './backgroundTasks';
import {
  completeSessionSelector,
  exportDataSelector,
  getTagStats,
  syncTimerWithRealTimeSelector,
} from './timerSelectors';
import * as Notifications from 'expo-notifications';
import { scheduleSessionCompleteNotification } from '~/utils/notificationUtils';

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      duration: 1500, // Default 25 minutes
      timeRemaining: 1500,
      isRunning: false,
      isPaused: false,
      sessions: [] as StudySession[],
      dailyTarget: 4 * 60 * 60, // Default 4 hours
      dailyProgress: [],
      currentTag: '',
      recentTags: [],
      isBackgroundMode: false,
      lastUpdatedTime: Date.now(),

      setDuration: (duration) => {
        const validDuration = Math.min(duration, MAX_DURATION);
        set({
          duration: validDuration,
          timeRemaining: validDuration,
        });
      },

      startTimer: async () => {
        // Register background task when timer starts
        if (Platform.OS !== 'web') {
          await registerBackgroundTask();
        }

        set({
          isRunning: true,
          isPaused: false,
          lastUpdatedTime: Date.now(),
        });

        const duration = get().timeRemaining;
        await scheduleSessionCompleteNotification(duration);
      },

      pauseTimer: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        // Unregister background task when timer pauses
        if (Platform.OS !== 'web') {
          await unregisterBackgroundTask();
        }

        set({
          isRunning: false,
          isPaused: true,
        });
      },

      resumeTimer: async () => {
        // Re-register background task when timer resumes
        if (Platform.OS !== 'web') {
          await registerBackgroundTask();
        }

        set({
          isRunning: true,
          isPaused: false,
          lastUpdatedTime: Date.now(),
        });

        const duration = get().timeRemaining;
        await scheduleSessionCompleteNotification(duration);
      },

      resetTimer: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();

        // Unregister background task when timer resets
        if (Platform.OS !== 'web') {
          await unregisterBackgroundTask();
        }

        set({
          timeRemaining: get().duration,
          isRunning: false,
          isPaused: false,
          isBackgroundMode: false,
        });
      },

      completeSession: async (completed) => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        await completeSessionSelector(get, set, completed);
      },

      setDailyTarget: (hours) => {
        // Convert hours to seconds and validate
        const targetInSeconds = Math.max(
          MIN_DAILY_TARGET,
          Math.min(hours * 60 * 60, MAX_DAILY_TARGET)
        );

        set({ dailyTarget: targetInSeconds });
      },

      setCurrentTag: (tag) => {
        set({ currentTag: tag });
      },

      getTagStats: () => getTagStats(get().sessions),

      setBackgroundMode: (isBackground) => {
        set({ isBackgroundMode: isBackground });
      },

      // Method to sync timer with real time when app comes back from background
      syncTimerWithRealTime: () => {
        syncTimerWithRealTimeSelector(get, set);
      },

      exportData: async () => {
        return await exportDataSelector(get);
      },
    }),
    {
      name: 'study-timer-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

defineBackgroundTask(useTimerStore);

export default useTimerStore;
