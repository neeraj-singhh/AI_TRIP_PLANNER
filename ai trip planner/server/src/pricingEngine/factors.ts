import { getSeason, isWeekend, daysUntil } from '../utils/timeUtils';

export function distanceMultiplier(km: number, mode: string) {
  const base = km / 500;
  const modeFactor = mode === 'flight' ? 1.1 : mode === 'car' ? 1.0 : 0.9;
  return 0.6 + base * 0.4 * modeFactor;
}

export function seasonMultiplier(date: Date, mode: string) {
  const season = getSeason(date);
  if (season === 'peak_summer') return mode === 'flight' ? 1.4 : 1.25;
  if (season === 'winter') return 1.2;
  if (season === 'monsoon') return mode === 'flight' ? 1.15 : 0.95;
  return 1.0;
}

export function weekendMultiplier(date: Date) {
  return isWeekend(date) ? 1.18 : 1.0;
}

export function advanceBookingMultiplier(date: Date) {
  const days = daysUntil(date);
  if (days > 45) return 0.85;
  if (days > 21) return 0.92;
  if (days > 7) return 1.0;
  if (days > 2) return 1.08;
  return 1.25;
}

export function categoryMultiplier(category: string, mode: string) {
  const base: Record<string, number> = {
    budget: 0.9,
    friends: 1.0,
    family: 1.05,
    group: 0.95,
    luxury: 1.3
  };
  const cat = base[category] ?? 1.0;
  const premiumMode = mode === 'flight' || mode === 'car' ? 1.05 : 1.0;
  return cat * premiumMode;
}

export function peopleMultiplier(numPeople: number) {
  if (numPeople <= 1) return 1.0;
  return Math.max(0.85, 1 - Math.log(numPeople) * 0.06);
}

export function surgeMultiplier(hour: number, mode: string) {
  const peakHours = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 21);
  if (!peakHours) return 1.0;
  return mode === 'car' ? 1.4 : mode === 'flight' ? 1.15 : 1.1;
}

