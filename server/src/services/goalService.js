import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";

function toPublicGoal(goal) {
  return {
    id: goal.id,
    dailyCalories: goal.dailyCalories,
    proteinTarget: goal.proteinTarget,
    carbsTarget: goal.carbsTarget,
    fatTarget: goal.fatTarget,
    weightGoal: goal.weightGoal,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
  };
}

export async function getGoalForUser(userId) {
  const goal = await prisma.goal.findUnique({
    where: { userId },
  });

  if (!goal) {
    throw new AppError("Goals not found. Create your goals first.", 404);
  }

  return toPublicGoal(goal);
}

export async function createGoalForUser(userId, input) {
  const existing = await prisma.goal.findUnique({
    where: { userId },
  });

  if (existing) {
    throw new AppError(
      "Goals already exist. Use PUT /api/goals to update them.",
      409,
    );
  }

  const goal = await prisma.goal.create({
    data: {
      userId,
      dailyCalories: input.dailyCalories,
      proteinTarget: input.proteinTarget,
      carbsTarget: input.carbsTarget,
      fatTarget: input.fatTarget,
      weightGoal: input.weightGoal ?? null,
    },
  });

  return toPublicGoal(goal);
}

export async function updateGoalForUser(userId, input) {
  const existing = await prisma.goal.findUnique({
    where: { userId },
  });

  if (!existing) {
    throw new AppError("Goals not found. Create your goals first.", 404);
  }

  const goal = await prisma.goal.update({
    where: { userId },
    data: {
      dailyCalories: input.dailyCalories,
      proteinTarget: input.proteinTarget,
      carbsTarget: input.carbsTarget,
      fatTarget: input.fatTarget,
      weightGoal: input.weightGoal === undefined ? existing.weightGoal : input.weightGoal,
    },
  });

  return toPublicGoal(goal);
}
