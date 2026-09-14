import { z } from "zod";

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

export const createGoalSchema = z
  .object({
    dailyCalories: positiveNumber("dailyCalories"),
    proteinTarget: nonNegativeNumber("proteinTarget"),
    carbsTarget: nonNegativeNumber("carbsTarget"),
    fatTarget: nonNegativeNumber("fatTarget"),
    weightGoal: positiveNumber("weightGoal").nullable().optional(),
  })
  .strict();

export const updateGoalSchema = z
  .object({
    dailyCalories: positiveNumber("dailyCalories"),
    proteinTarget: nonNegativeNumber("proteinTarget"),
    carbsTarget: nonNegativeNumber("carbsTarget"),
    fatTarget: nonNegativeNumber("fatTarget"),
    weightGoal: positiveNumber("weightGoal").nullable().optional(),
  })
  .strict();
