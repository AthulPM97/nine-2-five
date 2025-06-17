import { TamaguiProvider } from 'tamagui';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import config from '../tamagui.config';
import useColorSchemeStore from '~/store/colorSchemeStore';
import useTimerStore from '~/store/timerStore';
import {
  useNotificationPermissions,
  useAppStateHandler,
  useKeepAwake,
  useSplashScreen,
} from '~/hooks/useAppEffects';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Configure notification handling
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('timer-complete', {
    name: 'Timer Completion',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
    sound: 'default',
  });
}
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH,
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

  // Custom hooks
  useNotificationPermissions();
  useAppStateHandler(isRunning, isPaused, setBackgroundMode, syncTimerWithRealTime);
  useKeepAwake(isRunning, isPaused);
  useSplashScreen(loaded);

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
