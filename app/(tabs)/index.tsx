import { useEffect, useState, useRef } from 'react';
import { Platform, AppState, StatusBar } from 'react-native';
import { Target, Tag, Bell } from 'lucide-react-native';
import TimerDisplay from '~/components/TimerDisplay';
import TimerControls from '~/components/TimerControls';
import DurationPicker from '~/components/DurationPicker';
import SessionCompleteModal from '~/components/SessionCompleteModal';
import DailyTargetModal from '~/components/DailyTargetModal';
import DailyProgressBar from '~/components/DailyProgressBar';
import TagSelectorModal from '~/components/TagSelectorModal';
import useTimerStore from '~/store/timerStore';
import { getTodayDateString } from '~/utils/dateUtils';
import { useTheme, YStack, XStack, Text, Button, ScrollView, Theme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import useColorSchemeStore from '~/store/colorSchemeStore';

export default function TimerScreen() {
  const {
    duration,
    timeRemaining,
    isRunning,
    isPaused,
    dailyTarget,
    dailyProgress,
    currentTag,
    isBackgroundMode,
    setDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeSession,
    syncTimerWithRealTime,
  } = useTimerStore();

  const theme = useTheme();
  const { colorScheme } = useColorSchemeStore();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef(AppState.currentState);

  // Get today's progress
  const today = getTodayDateString();
  const todayProgress = dailyProgress.find((p) => p.date === today);
  const todaySeconds = todayProgress ? todayProgress.totalSeconds : 0;

  // Sync timer with real time when app becomes active
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        syncTimerWithRealTime();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [syncTimerWithRealTime]);

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && !isBackgroundMode) {
      timerRef.current = setInterval(() => {
        useTimerStore.setState((state) => {
          const newTimeRemaining = Math.max(0, state.timeRemaining - 1);

          if (newTimeRemaining === 0 && state.timeRemaining > 0) {
            clearInterval(timerRef.current!);
            setShowCompletionModal(true);
            completeSession(true);
            return { timeRemaining: 0, isRunning: false };
          }

          return { timeRemaining: newTimeRemaining, lastUpdatedTime: Date.now() };
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, isBackgroundMode]);

  const handleDurationChange = (newDuration: number) => {
    if (!isRunning && !isPaused) {
      setDuration(newDuration);
    }
  };

  const handleStop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    completeSession(false);
  };

  const handleStartTimer = () => {
    setShowTagModal(true);
  };

  const handleTagSelected = () => {
    setShowTagModal(false);
    startTimer();
  };

  return (
    <Theme name={colorScheme}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme.background.val}
        />
        <ScrollView
          flex={1}
          bg="$background"
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: Platform.OS === 'ios' ? 20 : 20,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}>
          <YStack gap="$2.5">
            {/* Header */}
            <YStack mb="$3" ai="center">
              <Text fontFamily="$mono" fontSize={28} fontWeight="700" color="$color" mb="$2">
                Focus Time
              </Text>
              <Text fontSize={16} fontFamily="$mono" color="$gray10">
                Stay productive and focused
              </Text>
            </YStack>

            {/* Daily Target Progress */}
            <YStack bg="$gray4" borderRadius={16} p="$4" mb="$5" elevation={10}>
              <XStack jc="space-between" ai="center" mb="$3">
                <Text fontSize={16} fontFamily="$mono" fontWeight="600" color="$color">
                  Daily Target
                </Text>
                <Button
                  chromeless
                  size="$2"
                  onPress={() => setShowTargetModal(true)}
                  icon={<Target size={16} color={theme.blue10.val} />}>
                  <Text fontSize={14} fontFamily="$mono" color="$blue10" fontWeight="500">
                    Set Target
                  </Text>
                </Button>
              </XStack>
              <DailyProgressBar currentSeconds={todaySeconds} targetSeconds={dailyTarget} />
            </YStack>

            {!isRunning && !isPaused && (
              <DurationPicker onSelectDuration={handleDurationChange} selectedDuration={duration} />
            )}

            {/* Current subject tag display */}
            {currentTag && (isRunning || isPaused) && (
              <XStack
                ai="center"
                jc="center"
                bg="$gray2"
                py="$2"
                px="$4"
                borderRadius={20}
                alignSelf="center"
                mb={40}
                gap="$2">
                <Tag size={16} color={theme.blue10.val} />
                <Text fontSize={16} fontWeight="500" color="$color">
                  Studying: {currentTag}
                </Text>
              </XStack>
            )}

            {/* Background mode indicator */}
            {isBackgroundMode && (
              <XStack
                ai="center"
                jc="center"
                bg="$gray2"
                py="$2"
                px="$4"
                borderRadius={20}
                alignSelf="center"
                mb="$4"
                gap="$2">
                <Bell size={16} color={theme.blue10.val} />
                <Text fontSize={16} fontWeight="500" color="$blue10">
                  Timer running in background
                </Text>
              </XStack>
            )}

            <YStack ai="center" jc="center" my={60}>
              <TimerDisplay
                timeRemaining={timeRemaining}
                duration={duration}
                isBackgroundMode={isBackgroundMode}
              />
            </YStack>

            <TimerControls
              isRunning={isRunning}
              isPaused={isPaused}
              isBackgroundMode={isBackgroundMode}
              onStart={handleStartTimer}
              onPause={pauseTimer}
              onResume={resumeTimer}
              onReset={resetTimer}
              onStop={handleStop}
            />

            <SessionCompleteModal
              visible={showCompletionModal}
              onClose={() => setShowCompletionModal(false)}
            />

            <DailyTargetModal visible={showTargetModal} onClose={() => setShowTargetModal(false)} />

            <TagSelectorModal
              visible={showTagModal}
              onClose={() => setShowTagModal(false)}
              onTagSelected={handleTagSelected}
            />
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </Theme>
  );
}
