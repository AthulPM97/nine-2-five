import { DailyProgress } from "~/types/timer";

export const getLast7DaysTotalSeconds = (dailyProgress: DailyProgress[]) => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  return dailyProgress
    .filter(p => last7Days.includes(p.date))
    .reduce((sum, p) => sum + p.totalSeconds, 0);
};