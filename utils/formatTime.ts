export function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

// Format total study time
export const formatTotalTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  if (mins < 60) {
    return `${mins} minutes`;
  } else {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMins > 0 ? `${remainingMins} minute${remainingMins !== 1 ? 's' : ''}` : ''}`;
  }
};
