import { create } from 'zustand';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundTask from 'expo-background-task';
import { Platform } from 'react-native';
import { BACKGROUND_TIMER_TASK } from './timerConstants';

interface BackgroundTaskState {
  defineTask: () => void;
  register: () => Promise<void>;
  unregister: () => Promise<void>;
}

export const useBackgroundTaskStore = create<BackgroundTaskState>()((set, get) => ({
  defineTask: () => {
    if (Platform.OS !== 'web') {
      TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
        try {
          return BackgroundTask.BackgroundTaskResult.Success;
        } catch (error) {
          console.error('Background task error:', error);
          return BackgroundTask.BackgroundTaskResult.Failed;
        }
      });
    }
  },

  register: async () => {
    if (Platform.OS === 'web') return;
    try {
      await BackgroundTask.registerTaskAsync(BACKGROUND_TIMER_TASK, {
        minimumInterval: 1000,
      });
      console.log('Background task registered successfully');
    } catch (err) {
      console.error('Background task registration failed:', err);
    }
  },

  unregister: async () => {
    if (Platform.OS === 'web') return;
    try {
      await BackgroundTask.unregisterTaskAsync(BACKGROUND_TIMER_TASK);
      console.log('Background task unregistered successfully');
    } catch (err) {
      console.error('Background task unregistration failed:', err);
    }
  },
}));
