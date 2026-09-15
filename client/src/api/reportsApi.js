import { apiRequest } from "./client.js";

function toQuery(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getDailyReport(params = {}) {
  return apiRequest(`/api/reports/daily${toQuery(params)}`);
}

export function getWeeklyReport(params = {}) {
  return apiRequest(`/api/reports/weekly${toQuery(params)}`);
}

export function getMacrosReport(params = {}) {
  return apiRequest(`/api/reports/macros${toQuery(params)}`);
}

export function getMicrosReport(params = {}) {
  return apiRequest(`/api/reports/micros${toQuery(params)}`);
}
