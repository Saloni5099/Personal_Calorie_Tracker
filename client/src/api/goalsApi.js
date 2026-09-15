import { apiRequest } from "./client.js";

export function getGoals() {
  return apiRequest("/api/goals");
}

export function createGoals(data) {
  return apiRequest("/api/goals", {
    method: "POST",
    body: data,
  });
}

export function updateGoals(data) {
  return apiRequest("/api/goals", {
    method: "PUT",
    body: data,
  });
}
