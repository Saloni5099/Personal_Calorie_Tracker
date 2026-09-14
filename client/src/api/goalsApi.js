import { apiRequest } from "./client.js";

export function getGoals() {
  return apiRequest("/goals");
}

export function createGoals(data) {
  return apiRequest("/goals", {
    method: "POST",
    body: data,
  });
}

export function updateGoals(data) {
  return apiRequest("/goals", {
    method: "PUT",
    body: data,
  });
}
