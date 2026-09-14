import { apiRequest } from "./client.js";

/**
 * Fetches the authenticated user's meal streak.
 * Expects: { success: true, data: { currentStreak, longestStreak } }
 */
export function getStreak() {
  return apiRequest("/reports/streak");
}
