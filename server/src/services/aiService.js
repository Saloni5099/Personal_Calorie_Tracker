import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { validate } from "../utils/validate.js";
import {
  aiNutritionSchema,
  foodNutritionJsonSchema,
} from "../validators/aiValidators.js";

const SYSTEM_PROMPT = `You are a nutrition extraction assistant for a calorie tracker app.

Analyze the uploaded image and determine whether it is primarily:
- a packaged food nutrition label, or
- a photo of food / a plate of food, or
- unknown.

Rules:
1. For nutrition labels, prioritize values explicitly visible on the label.
2. For food photographs, provide reasonable estimates only.
3. Never pretend an uncertain value is exact.
4. Return null for any nutrition field that cannot reasonably be determined.
5. Never invent micronutrient values just to fill the schema.
6. mealType must be one of BREAKFAST, LUNCH, DINNER, SNACK (best guess is fine).
7. Set isEstimate to true for food photographs or any inferred values.
8. Set isEstimate to false only when values are clearly read from a nutrition label.
9. confidence must be low, medium, or high.
10. notes should briefly explain uncertainty or estimation.
11. Do not give medical advice or diagnoses.
12. Return only the structured object requested by the schema.
13. Quantity and unit rules:
    - For food photographs / plates (imageKind = food_photo): set quantity to 1 and unit to "serving". Nutrition values are estimates for that detected meal/serving. Do NOT invent an exact gram or milliliter weight.
    - For unknown images without an explicit serving size on the image: also use quantity 1 and unit "serving".
    - For nutrition labels (imageKind = nutrition_label): if a serving size is explicitly printed (e.g. "50 g", "1 cup", "240 ml"), extract that quantity and unit and keep nutrition values for that stated serving. If no serving size is readable, use quantity 1 and unit "serving".`;

function normalizeQuantityAndUnit(suggestion) {
  const isLabel = suggestion.imageKind === "nutrition_label";
  const unit =
    typeof suggestion.unit === "string" ? suggestion.unit.trim() : "";
  const hasExplicitServing =
    suggestion.quantity != null && unit.length > 0;

  if (isLabel && hasExplicitServing) {
    return {
      ...suggestion,
      unit,
    };
  }

  // Food photos / unknown / labels without a readable serving size.
  return {
    ...suggestion,
    quantity: 1,
    unit: "serving",
  };
}

function getClient() {
  if (!env.geminiApiKey) {
    throw new AppError(
      "AI food scanning is not configured on this server.",
      503,
    );
  }

  return new GoogleGenAI({ apiKey: env.geminiApiKey });
}

export async function analyzeFoodImage({ buffer, mimeType }) {
  const client = getClient();
  const base64 = buffer.toString("base64");

  let response;
  try {
    response = await client.models.generateContent({
      model: env.geminiModel,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "Extract structured nutrition information from this image for a meal entry form.",
            },
            {
              inlineData: {
                mimeType,
                data: base64,
              },
            },
          ],
        },
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: foodNutritionJsonSchema,
      },
    });
  } catch (error) {
    if (!env.isProd) {
      console.error("Gemini analyze-food failed:", error?.message || error);
    }
    throw new AppError(
      "We couldn't analyze this image. Please try another photo.",
      502,
    );
  }

  const rawText =
    typeof response.text === "string" ? response.text.trim() : "";
  if (!rawText) {
    throw new AppError(
      "We couldn't analyze this image. Please try another photo.",
      502,
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new AppError(
      "AI returned an unreadable nutrition result. Please try again.",
      502,
    );
  }

  let suggestion;
  try {
    suggestion = validate(aiNutritionSchema, parsed);
  } catch (error) {
    throw new AppError(
      "AI returned invalid nutrition data. Please try again.",
      502,
      error.errors,
    );
  }

  return normalizeQuantityAndUnit(suggestion);
}
