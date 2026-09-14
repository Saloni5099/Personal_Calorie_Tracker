import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { endOfUtcDay, startOfUtcDay } from "../utils/dates.js";

function toPublicMeal(meal) {
  return {
    id: meal.id,
    foodName: meal.foodName,
    mealType: meal.mealType,
    quantity: meal.quantity,
    unit: meal.unit,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    vitaminA: meal.vitaminA,
    vitaminC: meal.vitaminC,
    vitaminD: meal.vitaminD,
    calcium: meal.calcium,
    iron: meal.iron,
    consumedAt: meal.consumedAt,
    createdAt: meal.createdAt,
    updatedAt: meal.updatedAt,
  };
}

function buildMealData(input) {
  return {
    foodName: input.foodName,
    mealType: input.mealType,
    quantity: input.quantity,
    unit: input.unit,
    calories: input.calories,
    protein: input.protein,
    carbs: input.carbs,
    fat: input.fat,
    vitaminA: input.vitaminA ?? null,
    vitaminC: input.vitaminC ?? null,
    vitaminD: input.vitaminD ?? null,
    calcium: input.calcium ?? null,
    iron: input.iron ?? null,
    consumedAt: input.consumedAt,
  };
}

async function findOwnedMealOrThrow(userId, mealId) {
  const meal = await prisma.foodEntry.findFirst({
    where: {
      id: mealId,
      userId,
    },
  });

  if (!meal) {
    throw new AppError("Meal not found", 404);
  }

  return meal;
}

export async function createMeal(userId, input) {
  const meal = await prisma.foodEntry.create({
    data: {
      userId,
      ...buildMealData(input),
    },
  });

  return toPublicMeal(meal);
}

export async function listMeals(userId, query) {
  const { page, limit, mealType, startDate, endDate } = query;

  const where = { userId };

  if (mealType) {
    where.mealType = mealType;
  }

  if (startDate || endDate) {
    where.consumedAt = {};
    if (startDate) {
      where.consumedAt.gte = startOfUtcDay(startDate);
    }
    if (endDate) {
      where.consumedAt.lte = endOfUtcDay(endDate);
    }
  }

  const skip = (page - 1) * limit;

  const [total, meals] = await Promise.all([
    prisma.foodEntry.count({ where }),
    prisma.foodEntry.findMany({
      where,
      orderBy: [{ consumedAt: "desc" }, { id: "desc" }],
      skip,
      take: limit,
    }),
  ]);

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    meals: meals.map(toPublicMeal),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export async function getMealById(userId, mealId) {
  const meal = await findOwnedMealOrThrow(userId, mealId);
  return toPublicMeal(meal);
}

export async function updateMeal(userId, mealId, input) {
  const result = await prisma.foodEntry.updateMany({
    where: {
      id: mealId,
      userId,
    },
    data: buildMealData(input),
  });

  if (result.count === 0) {
    throw new AppError("Meal not found", 404);
  }

  const meal = await prisma.foodEntry.findFirst({
    where: {
      id: mealId,
      userId,
    },
  });

  return toPublicMeal(meal);
}

export async function deleteMeal(userId, mealId) {
  const result = await prisma.foodEntry.deleteMany({
    where: {
      id: mealId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new AppError("Meal not found", 404);
  }
}
