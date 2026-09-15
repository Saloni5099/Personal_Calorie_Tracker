import { apiRequest } from "./client.js";

export function analyzeFoodImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return apiRequest("/api/ai/analyze-food", {
    method: "POST",
    body: formData,
  });
}
