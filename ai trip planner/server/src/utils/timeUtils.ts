export function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 0 || d === 6;
}

export function daysUntil(date: Date) {
  const now = new Date();
  const ms = date.getTime() - now.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

export function getSeason(date: Date): 'peak_summer' | 'monsoon' | 'winter' | 'shoulder' {
  const m = date.getMonth() + 1;
  if (m >= 11 || m <= 2) return 'winter';
  if (m >= 3 && m <= 5) return 'peak_summer';
  if (m >= 6 && m <= 9) return 'monsoon';
  return 'shoulder';
}

