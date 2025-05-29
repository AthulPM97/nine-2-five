import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { Platform } from 'react-native';
import { BACKGROUND_TIMER_TASK } from './timerConstants';

export const defineBackgroundTask = (timerStore: any) => {
  if (Platform.OS !== 'web') {
    TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
      try {
        const store = timerStore.getState();

        if (store.isRunning && !store.isPaused) {
          const newTimeRemaining = Math.max(0, store.timeRemaining - 1);

          // Check if timer has reached zero
          if (newTimeRemaining === 0 && store.timeRemaining > 0) {
            // Timer completed in background
            store.completeSession(true);
            return BackgroundFetch.BackgroundFetchResult.NewData;
          }

          store.setState({ timeRemaining: newTimeRemaining });
          return BackgroundFetch.BackgroundFetchResult.NewData;
        }

        return BackgroundFetch.BackgroundFetchResult.NoData;
      } catch (error) {
        console.error('Background task error:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });
  }
};

// Register the background task
export const registerBackgroundTask = async () => {
  if (Platform.OS === 'web') return;

  try {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
      minimumInterval: 1, // 1 second
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log('Background task registered');
  } catch (err) {
    console.error('Background task registration failed:', err);
  }
};

// Unregister the background task
export const unregisterBackgroundTask = async () => {
  if (Platform.OS === 'web') return;

  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TIMER_TASK);
    console.log('Background task unregistered');
  } catch (err) {
    console.error('Background task unregistration failed:', err);
  }
};
