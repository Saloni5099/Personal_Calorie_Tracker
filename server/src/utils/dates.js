/**
 * Shared UTC calendar-day helpers (same convention as Meals API).
 * startDate=YYYY-MM-DD → 00:00:00.000Z
 * endDate=YYYY-MM-DD   → 23:59:59.999Z
 */

export function startOfUtcDay(dateStr) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export function endOfUtcDay(dateStr) {
  return new Date(`${dateStr}T23:59:59.999Z`);
}

/** Format a Date as YYYY-MM-DD in UTC. */
export function toUtcDateString(date) {
  return date.toISOString().slice(0, 10);
}

/** Today's UTC calendar date as YYYY-MM-DD. */
export function todayUtcDateString() {
  return toUtcDateString(new Date());
}

/** Inclusive list of YYYY-MM-DD strings from startDate to endDate (UTC). */
export function eachUtcDateInclusive(startDate, endDate) {
  const dates = [];
  const cursor = startOfUtcDay(startDate);
  const last = startOfUtcDay(endDate);

  while (cursor <= last) {
    dates.push(toUtcDateString(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

/** Default weekly window: today UTC and the previous 6 days (7 days total). */
export function defaultWeeklyRangeUtc() {
  const endDate = todayUtcDateString();
  const start = startOfUtcDay(endDate);
  start.setUTCDate(start.getUTCDate() - 6);
  return {
    startDate: toUtcDateString(start),
    endDate,
  };
}
