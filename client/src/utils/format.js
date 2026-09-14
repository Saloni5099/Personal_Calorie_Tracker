/** Display helpers only — not used for authoritative nutrition math. */

export function todayUtcDateString() {
  return new Date().toISOString().slice(0, 10);
}

export function formatDisplayDate(dateStr) {
  const date = new Date(`${dateStr}T12:00:00.000Z`);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatShortWeekday(dateStr) {
  const date = new Date(`${dateStr}T12:00:00.000Z`);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatNumber(value, digits = 0) {
  const num = Number(value) || 0;
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(num);
}

export function formatTimeUtc(isoString) {
  if (!isoString) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(isoString));
}

export function progressPercent(actual, goal) {
  if (!goal || goal <= 0) return 0;
  return Math.min(100, Math.round((actual / goal) * 100));
}
