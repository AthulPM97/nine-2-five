import { useEffect } from 'react';
import { TamaguiProvider } from 'tamagui';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { AppState, Platform } from 'react-native';
import * as KeepAwake from 'expo-keep-awake';

import config from '../tamagui.config';
import useColorSchemeStore from '~/store/colorSchemeStore';
import useTimerStore from '~/store/timerStore';

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
  // Load fonts
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  const { colorScheme } = useColorSchemeStore();
  const { isRunning, isPaused, setBackgroundMode, syncTimerWithRealTime } = useTimerStore();

  // Request notification permissions on mount
  useEffect(() => {
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

  // Hide splash screen when fonts are loaded
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
        <Stack.Screen name="modal" options={{ headerShown: false, title: 'Settings' }} />
      </Stack>
    </TamaguiProvider>
  );
}
