import { Platform } from 'react-native';
import { StudySession } from '~/types/timer';
import { getTodayDateString, MAX_RECENT_TAGS } from './timerConstants';
import { TimerState, TagStats } from '~/types/timer';
import { useBackgroundTaskStore } from './backgroundTaskStore';

export async function completeSessionSelector(get: any, set: any, completed: boolean) {
  // Unregister background task when session completes
  if (Platform.OS !== 'web') {
    await useBackgroundTaskStore.getState().unregister();
  }

  const sessionDuration = get().duration - get().timeRemaining;
  const currentTag = get().currentTag || 'Untagged';

  const newSession: StudySession = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    duration: sessionDuration,
    completed,
    tag: currentTag,
  };

  // Update daily progress
  const today = getTodayDateString();
  const currentProgress = get().dailyProgress;
  const todayProgressIndex = currentProgress.findIndex((p: any) => p.date === today);

  let updatedProgress = [...currentProgress];

  if (todayProgressIndex >= 0) {
    // Update existing progress for today
    updatedProgress[todayProgressIndex] = {
      ...updatedProgress[todayProgressIndex],
      totalSeconds: updatedProgress[todayProgressIndex].totalSeconds + sessionDuration,
    };
  } else {
    // Add new progress entry for today
    updatedProgress.push({
      date: today,
      totalSeconds: sessionDuration,
    });
  }

  // Update recent tags
  const recentTags = get().recentTags;
  let updatedRecentTags = recentTags.filter((tag: string) => tag !== currentTag); // Remove current tag if exists
  updatedRecentTags.unshift(currentTag); // Add current tag to the beginning
  updatedRecentTags = updatedRecentTags.slice(0, MAX_RECENT_TAGS); // Keep only the most recent tags

  set((state: any) => ({
    sessions: [...state.sessions, newSession],
    dailyProgress: updatedProgress,
    timeRemaining: state.duration,
    isRunning: false,
    isPaused: false,
    recentTags: updatedRecentTags,
    currentTag: '', // Reset current tag
    isBackgroundMode: false,
  }));
}

export function getTagStats(sessions: TimerState['sessions']): TagStats[] {
  const tagMap = new Map<string, { totalSeconds: number; sessionCount: number }>();
  sessions.forEach((session) => {
    const tag = session.tag || 'Untagged';
    const current = tagMap.get(tag) || { totalSeconds: 0, sessionCount: 0 };
    tagMap.set(tag, {
      totalSeconds: current.totalSeconds + session.duration,
      sessionCount: current.sessionCount + 1,
    });
  });
  return Array.from(tagMap.entries())
    .map(([tag, stats]) => ({
      tag,
      totalSeconds: stats.totalSeconds,
      sessionCount: stats.sessionCount,
    }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);
}

export function syncTimerWithRealTimeSelector(get: any, set: any) {
  const state = get();
  if (state.isRunning && !state.isPaused) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - state.lastUpdatedTime) / 1000);

    if (elapsedSeconds > 0) {
      const newTimeRemaining = Math.max(0, state.timeRemaining - elapsedSeconds);

      // Check if timer should have completed while in background
      if (newTimeRemaining === 0 && state.timeRemaining > 0) {
        // Timer completed while in background
        set({
          timeRemaining: 0,
          lastUpdatedTime: now,
        });

        // Complete the session
        get().completeSession(true);
      } else {
        // Just update the time
        set({
          timeRemaining: newTimeRemaining,
          lastUpdatedTime: now,
        });
      }
    }
  }
}

export async function exportDataSelector(get: any) {
  const { sessions, dailyProgress, recentTags, currentTag, dailyTarget } = get();
  const exportObj = {
    sessions,
    dailyProgress,
    recentTags,
    currentTag,
    dailyTarget,
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(exportObj, null, 2);
}
