import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';

import config from '../tamagui.config';

// --- Add these imports for app state/background handling ---
import { AppState, Platform } from 'react-native';
import useTimerStore from '~/store/timerStore';
import * as KeepAwake from 'expo-keep-awake';
// ----------------------------------------------------------

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  // --- App state and background handling logic START ---
  const { isRunning, isPaused, setBackgroundMode, syncTimerWithRealTime } = useTimerStore();

  // Handle app state changes (foreground/background)
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

  // Keep screen awake when timer is running
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
  // --- App state and background handling logic END ---

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </TamaguiProvider>
  );
}
