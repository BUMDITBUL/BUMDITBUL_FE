export const MAX_DAILY_REGEN = 2;
const STORAGE_PREFIX = "plan_regen_";

function todayKey() {
  return STORAGE_PREFIX + new Date().toDateString();
}

export function getRegenCount(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(todayKey()) ?? "0", 10);
}

export function canRegen(): boolean {
  return getRegenCount() < MAX_DAILY_REGEN;
}

export function incrementRegenCount(): void {
  localStorage.setItem(todayKey(), String(getRegenCount() + 1));
}

export function remainingRegen(): number {
  return Math.max(0, MAX_DAILY_REGEN - getRegenCount());
}
