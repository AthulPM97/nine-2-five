// Timer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, AppState, AppStateStatus } from 'react-native';

type TimerProps = {
  initialTimeInSeconds?: number;
  onTimerComplete?: () => void;
  autoStart?: boolean;
};

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Timer: React.FC<TimerProps> = ({
  initialTimeInSeconds = 60,
  onTimerComplete,
  autoStart = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeInSeconds);
  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const [isPaused, setIsPaused] = useState<boolean>(!autoStart); // If autoStart, not paused initially

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<string>(AppState.currentState);
  const backgroundTimeRef = useRef<number | null>(null); // To store timestamp when app goes to background

  // --- App State Handling (for backgrounding) ---
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        if (isActive && backgroundTimeRef.current) {
          const timeInBackground = Math.floor((Date.now() - backgroundTimeRef.current) / 1000);
          setTimeLeft(prevTime => Math.max(0, prevTime - timeInBackground));
        }
        backgroundTimeRef.current = null; // Reset background time
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        if (isActive) {
          backgroundTimeRef.current = Date.now();
          // Optional: Clear interval here if you don't want it to "catch up"
          // clearInterval(intervalRef.current);
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]); // Re-subscribe if isActive changes

  // --- Core Timer Logic ---
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsActive(false);
            setIsPaused(false); // Reset paused state
            if (onTimerComplete) {
              onTimerComplete();
            }
            return 0; // Ensure it stops at 0
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    // Cleanup interval on component unmount or when isActive/isPaused changes
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isPaused, onTimerComplete]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(initialTimeInSeconds);
    }
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsActive(false);
    setIsPaused(true);
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current); // Clear any running interval
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(initialTimeInSeconds);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        {!isActive && isPaused && (
          <Button title="Resume" onPress={handleStart} color="#4CAF50" />
        )}
        {!isActive && !isPaused && (
          <Button title={timeLeft === 0 ? "Start" : "Start"} onPress={handleStart} color="#4CAF50" />
        )}
        {isActive && !isPaused && (
          <Button title="Pause" onPress={handlePause} color="#FFC107" />
        )}
        <Button
          title="Reset"
          onPress={handleReset}
          color="#F44336"
          disabled={!isActive && !isPaused && timeLeft === initialTimeInSeconds}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    margin: 10,
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
});

export default Timer;