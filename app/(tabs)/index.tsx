import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Colors from '~/constants/colors';
import TimerDisplay from '~/components/TimerDisplay';
import TimerControls from '~/components/TimerControls';
import DurationPicker from '~/components/DurationPicker';
import SessionCompleteModal from '~/components/SessionCompleteModal';
import useTimerStore from '~/store/timerStore';
import { Platform } from 'react-native';

export default function TimerScreen() {
  const {
    duration,
    timeRemaining,
    isRunning,
    isPaused,
    setDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    completeSession,
  } = useTimerStore();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        useTimerStore.setState((state) => {
          const newTimeRemaining = Math.max(0, state.timeRemaining - 1);

          // Check if timer has reached zero
          if (newTimeRemaining === 0 && state.timeRemaining > 0) {
            clearInterval(timerRef.current!);
            setShowCompletionModal(true);
            completeSession(true);
            return { timeRemaining: 0, isRunning: false };
          }

          return { timeRemaining: newTimeRemaining };
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
  }, [isRunning]);

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />

      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Focus Time</Text>
        <Text style={styles.headerSubtitle}>Stay productive and focused</Text>
      </View>

      {!isRunning && !isPaused && (
        <DurationPicker onSelectDuration={handleDurationChange} selectedDuration={duration} />
      )}

      <View style={styles.timerContainer}>
        <TimerDisplay timeRemaining={timeRemaining} duration={duration} />
      </View>

      <TimerControls
        isRunning={isRunning}
        isPaused={isPaused}
        onStart={startTimer}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onReset={resetTimer}
        onStop={handleStop}
      />

      <SessionCompleteModal
        visible={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        duration={duration}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.darkGray,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60,
  },
});
