export const MAX_DURATION = 7200;
export const MIN_DAILY_TARGET = 1 * 60 * 60;
export const MAX_DAILY_TARGET = 9 * 60 * 60;
export const MAX_RECENT_TAGS = 5;
export const BACKGROUND_TIMER_TASK = 'BACKGROUND_TIMER_TASK';

export const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};
