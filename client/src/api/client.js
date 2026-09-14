const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.warn("VITE_API_URL is not set. API requests will fail.");
}

export class ApiError extends Error {
  constructor(message, status, errors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function getStoredToken() {
  return localStorage.getItem("pct_token");
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem("pct_token", token);
  } else {
    localStorage.removeItem("pct_token");
  }
}

export function clearStoredToken() {
  localStorage.removeItem("pct_token");
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    token = getStoredToken(),
    auth = true,
  } = options;

  const headers = {
    Accept: "application/json",
  };

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  // Let the browser set multipart boundaries for FormData uploads.
  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body:
        body === undefined
          ? undefined
          : isFormData
            ? body
            : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Unable to connect to the server. Please try again.",
      0,
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message || "Something went wrong. Please try again.",
      response.status,
      payload?.errors || null,
    );
  }

  return payload;
}
