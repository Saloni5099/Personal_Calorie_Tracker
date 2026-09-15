import { apiRequest } from "./client.js";

export function register(data) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function login(data) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function getMe(token) {
  return apiRequest("/api/auth/me", {
    method: "GET",
    token,
  });
}
