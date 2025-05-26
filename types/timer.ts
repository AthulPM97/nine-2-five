export interface StudySession {
  id: string;
  date: string;
  duration: number; // in seconds
  completed: boolean;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  totalSeconds: number;
}

export interface TimerState {
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  sessions: StudySession[];
  dailyTarget: number; // in seconds
  dailyProgress: DailyProgress[];

  // Actions
  setDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeSession: (completed: boolean) => void;
  setDailyTarget: (hours: number) => void;
}
