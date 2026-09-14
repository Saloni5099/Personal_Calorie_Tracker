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

export function getMeals(params = {}) {
  return apiRequest(`/meals${toQuery(params)}`);
}

export function getMealById(id) {
  return apiRequest(`/meals/${id}`);
}

export function createMeal(data) {
  return apiRequest("/meals", {
    method: "POST",
    body: data,
  });
}

export function updateMeal(id, data) {
  return apiRequest(`/meals/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function deleteMeal(id) {
  return apiRequest(`/meals/${id}`, {
    method: "DELETE",
  });
}
