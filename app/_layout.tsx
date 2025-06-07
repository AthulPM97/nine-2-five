import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

import config from '../tamagui.config';
import useColorSchemeStore from '~/store/colorSchemeStore';

// --- Add these imports for app state/background handling ---
import { AppState, Platform } from 'react-native';
import useTimerStore from '~/store/timerStore';
import * as KeepAwake from 'expo-keep-awake';
// ----------------------------------------------------------

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowList: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const { colorScheme, toggleColorScheme } = useColorSchemeStore();

  // --- App state and background handling logic START ---
  const { isRunning, isPaused, setBackgroundMode, syncTimerWithRealTime } = useTimerStore();

  useEffect(() => {
    // Request permissions on mount
    Notifications.requestPermissionsAsync();
  }, []);

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
    <TamaguiProvider config={config} defaultTheme={colorScheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: 'Settings' }} />
      </Stack>
    </TamaguiProvider>
  );
}
