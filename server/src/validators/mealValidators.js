import { z } from "zod";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

const nonNegativeNumber = (label) =>
  z
    .number({
      error: `${label} must be a number`,
    })
    .min(0, `${label} cannot be negative`);

const positiveNumber = (label) =>
  z
    .number({
      error: `${label} must be a number`,
    })
    .gt(0, `${label} must be greater than 0`);

const mealTypeSchema = z.enum(MEAL_TYPES, {
  error: "mealType must be BREAKFAST, LUNCH, DINNER, or SNACK",
});

const optionalMicro = (label) => nonNegativeNumber(label).nullable().optional();

const consumedAtSchema = z
  .string({
    error: "consumedAt must be a valid ISO date-time string",
  })
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "consumedAt must be a valid date",
  })
  .transform((value) => new Date(value));

const mealFieldsSchema = z.object({
  foodName: z
    .string()
    .trim()
    .min(1, "foodName is required")
    .max(200, "foodName must be at most 200 characters"),
  mealType: mealTypeSchema,
  quantity: positiveNumber("quantity"),
  unit: z
    .string()
    .trim()
    .min(1, "unit is required")
    .max(50, "unit must be at most 50 characters"),
  calories: nonNegativeNumber("calories"),
  protein: nonNegativeNumber("protein"),
  carbs: nonNegativeNumber("carbs"),
  fat: nonNegativeNumber("fat"),
  vitaminA: optionalMicro("vitaminA"),
  vitaminC: optionalMicro("vitaminC"),
  vitaminD: optionalMicro("vitaminD"),
  calcium: optionalMicro("calcium"),
  iron: optionalMicro("iron"),
  consumedAt: consumedAtSchema,
});

export const createMealSchema = mealFieldsSchema.strict();

export const updateMealSchema = mealFieldsSchema.strict();

const ymdDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format");

export const listMealsQuerySchema = z
  .object({
    page: z.coerce
      .number({
        error: "page must be a number",
      })
      .int("page must be an integer")
      .min(1, "page must be at least 1")
      .default(1),
    limit: z.coerce
      .number({
        error: "limit must be a number",
      })
      .int("limit must be an integer")
      .min(1, "limit must be at least 1")
      .max(100, "limit must be at most 100")
      .default(10),
    mealType: mealTypeSchema.optional(),
    startDate: ymdDate.optional(),
    endDate: ymdDate.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.startDate && value.endDate && value.startDate > value.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "startDate cannot be after endDate",
      });
    }
  });

export const mealIdParamSchema = z.object({
  id: z.coerce
    .number({
      error: "id must be a number",
    })
    .int("id must be an integer")
    .positive("id must be a positive integer"),
});
