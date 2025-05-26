export interface StudySession {
  id: string;
  date: string;
  duration: number; // in seconds
  completed: boolean;
}

export interface TimerState {
  duration: number; // in seconds
  timeRemaining: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  sessions: StudySession[];

  // Actions
  setDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeSession: (completed: boolean) => void;
}
