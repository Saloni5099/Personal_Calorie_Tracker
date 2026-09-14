import { z } from "zod";

export const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

const nullableNonNegative = z
  .number()
  .min(0, "Value cannot be negative")
  .nullable();

export const aiNutritionSchema = z
  .object({
    foodName: z.string().trim().min(1).max(200),
    mealType: z.enum(MEAL_TYPES),
    quantity: z.number().positive().nullable(),
    unit: z.string().trim().min(1).max(50).nullable(),
    calories: z.number().min(0).nullable(),
    protein: z.number().min(0).nullable(),
    carbs: z.number().min(0).nullable(),
    fat: z.number().min(0).nullable(),
    vitaminA: nullableNonNegative,
    vitaminC: nullableNonNegative,
    vitaminD: nullableNonNegative,
    calcium: nullableNonNegative,
    iron: nullableNonNegative,
    confidence: z.enum(["low", "medium", "high"]),
    isEstimate: z.boolean(),
    notes: z.string().max(500),
    imageKind: z.enum(["nutrition_label", "food_photo", "unknown"]),
  })
  .strict();

/** JSON Schema for Gemini structured output (responseJsonSchema). */
export const foodNutritionJsonSchema = {
  type: "object",
  properties: {
    foodName: { type: "string" },
    mealType: {
      type: "string",
      enum: MEAL_TYPES,
    },
    quantity: { type: "number", nullable: true },
    unit: { type: "string", nullable: true },
    calories: { type: "number", nullable: true },
    protein: { type: "number", nullable: true },
    carbs: { type: "number", nullable: true },
    fat: { type: "number", nullable: true },
    vitaminA: { type: "number", nullable: true },
    vitaminC: { type: "number", nullable: true },
    vitaminD: { type: "number", nullable: true },
    calcium: { type: "number", nullable: true },
    iron: { type: "number", nullable: true },
    confidence: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
    isEstimate: { type: "boolean" },
    notes: { type: "string" },
    imageKind: {
      type: "string",
      enum: ["nutrition_label", "food_photo", "unknown"],
    },
  },
  required: [
    "foodName",
    "mealType",
    "quantity",
    "unit",
    "calories",
    "protein",
    "carbs",
    "fat",
    "vitaminA",
    "vitaminC",
    "vitaminD",
    "calcium",
    "iron",
    "confidence",
    "isEstimate",
    "notes",
    "imageKind",
  ],
};
