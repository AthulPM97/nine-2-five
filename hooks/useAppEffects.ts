import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as KeepAwake from 'expo-keep-awake';
import { SplashScreen } from 'expo-router';

export function useNotificationPermissions() {
  useEffect(() => {
    const requestPermissions = async () => {
      const settings = await Notifications.requestPermissionsAsync();
      if (!settings.granted) {
        alert('Notification permission is required');
      }
    };
    requestPermissions();
  }, []);
}

export function useAppStateHandler(
  isRunning: boolean,
  isPaused: boolean,
  setBackgroundMode: (mode: boolean) => void,
  syncTimerWithRealTime: () => void
) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setBackgroundMode(false);
        syncTimerWithRealTime();
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        if (isRunning && !isPaused) {
          setBackgroundMode(true);
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, [isRunning, isPaused, setBackgroundMode, syncTimerWithRealTime]);
}

export function useKeepAwake(isRunning: boolean, isPaused: boolean) {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      if (isRunning && !isPaused) {
        KeepAwake.activateKeepAwakeAsync();
      } else {
        KeepAwake.deactivateKeepAwake();
      }
    }
    return () => {
      if (Platform.OS !== 'web') {
        KeepAwake.deactivateKeepAwake();
      }
    };
  }, [isRunning, isPaused]);
}

export function useSplashScreen(loaded: boolean) {
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
}
