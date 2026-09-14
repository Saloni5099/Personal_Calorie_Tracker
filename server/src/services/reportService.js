import { prisma } from "../lib/prisma.js";
import {
  eachUtcDateInclusive,
  endOfUtcDay,
  startOfUtcDay,
  todayUtcDateString,
  toUtcDateString,
} from "../utils/dates.js";

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

const emptyMacros = () => ({
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
});

const emptyMicros = () => ({
  vitaminA: 0,
  vitaminC: 0,
  vitaminD: 0,
  calcium: 0,
  iron: 0,
});

function roundNutrient(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function toPublicGoals(goal) {
  if (!goal) {
    return null;
  }

  return {
    dailyCalories: goal.dailyCalories,
    proteinTarget: goal.proteinTarget,
    carbsTarget: goal.carbsTarget,
    fatTarget: goal.fatTarget,
    weightGoal: goal.weightGoal,
  };
}

function buildComparison(actual, goals) {
  if (!goals) {
    return {
      caloriesRemaining: null,
      proteinRemaining: null,
      carbsRemaining: null,
      fatRemaining: null,
      caloriesExcess: null,
      proteinExcess: null,
      carbsExcess: null,
      fatExcess: null,
    };
  }

  const remaining = (goal, consumed) =>
    roundNutrient(Math.max(0, goal - consumed));
  const excess = (goal, consumed) =>
    roundNutrient(Math.max(0, consumed - goal));

  return {
    caloriesRemaining: remaining(goals.dailyCalories, actual.calories),
    proteinRemaining: remaining(goals.proteinTarget, actual.protein),
    carbsRemaining: remaining(goals.carbsTarget, actual.carbs),
    fatRemaining: remaining(goals.fatTarget, actual.fat),
    caloriesExcess: excess(goals.dailyCalories, actual.calories),
    proteinExcess: excess(goals.proteinTarget, actual.protein),
    carbsExcess: excess(goals.carbsTarget, actual.carbs),
    fatExcess: excess(goals.fatTarget, actual.fat),
  };
}

async function getGoalsForUser(userId) {
  const goal = await prisma.goal.findUnique({
    where: { userId },
  });
  return toPublicGoals(goal);
}

async function fetchEntriesInRange(userId, startDate, endDate) {
  return prisma.foodEntry.findMany({
    where: {
      userId,
      consumedAt: {
        gte: startOfUtcDay(startDate),
        lte: endOfUtcDay(endDate),
      },
    },
    select: {
      mealType: true,
      consumedAt: true,
      calories: true,
      protein: true,
      carbs: true,
      fat: true,
      vitaminA: true,
      vitaminC: true,
      vitaminD: true,
      calcium: true,
      iron: true,
    },
    orderBy: { consumedAt: "asc" },
  });
}

function sumMacros(entries) {
  return entries.reduce(
    (acc, entry) => {
      acc.calories += entry.calories || 0;
      acc.protein += entry.protein || 0;
      acc.carbs += entry.carbs || 0;
      acc.fat += entry.fat || 0;
      return acc;
    },
    emptyMacros(),
  );
}

function sumMicros(entries) {
  return entries.reduce(
    (acc, entry) => {
      // Null micros are skipped (treated as "not logged"), not invented.
      if (entry.vitaminA != null) acc.vitaminA += entry.vitaminA;
      if (entry.vitaminC != null) acc.vitaminC += entry.vitaminC;
      if (entry.vitaminD != null) acc.vitaminD += entry.vitaminD;
      if (entry.calcium != null) acc.calcium += entry.calcium;
      if (entry.iron != null) acc.iron += entry.iron;
      return acc;
    },
    emptyMicros(),
  );
}

function roundMacroTotals(totals) {
  return {
    calories: roundNutrient(totals.calories),
    protein: roundNutrient(totals.protein),
    carbs: roundNutrient(totals.carbs),
    fat: roundNutrient(totals.fat),
  };
}

function roundMicroTotals(totals) {
  return {
    vitaminA: roundNutrient(totals.vitaminA),
    vitaminC: roundNutrient(totals.vitaminC),
    vitaminD: roundNutrient(totals.vitaminD),
    calcium: roundNutrient(totals.calcium),
    iron: roundNutrient(totals.iron),
  };
}

function buildDailyBuckets(entries, startDate, endDate) {
  const buckets = new Map(
    eachUtcDateInclusive(startDate, endDate).map((date) => [
      date,
      { ...emptyMacros(), ...emptyMicros() },
    ]),
  );

  for (const entry of entries) {
    const date = toUtcDateString(entry.consumedAt);
    const bucket = buckets.get(date);
    if (!bucket) {
      continue;
    }

    bucket.calories += entry.calories || 0;
    bucket.protein += entry.protein || 0;
    bucket.carbs += entry.carbs || 0;
    bucket.fat += entry.fat || 0;

    if (entry.vitaminA != null) bucket.vitaminA += entry.vitaminA;
    if (entry.vitaminC != null) bucket.vitaminC += entry.vitaminC;
    if (entry.vitaminD != null) bucket.vitaminD += entry.vitaminD;
    if (entry.calcium != null) bucket.calcium += entry.calcium;
    if (entry.iron != null) bucket.iron += entry.iron;
  }

  return [...buckets.entries()].map(([date, values]) => ({
    date,
    calories: roundNutrient(values.calories),
    protein: roundNutrient(values.protein),
    carbs: roundNutrient(values.carbs),
    fat: roundNutrient(values.fat),
    vitaminA: roundNutrient(values.vitaminA),
    vitaminC: roundNutrient(values.vitaminC),
    vitaminD: roundNutrient(values.vitaminD),
    calcium: roundNutrient(values.calcium),
    iron: roundNutrient(values.iron),
  }));
}

export async function getDailyReport(userId, date) {
  const [entries, goals] = await Promise.all([
    fetchEntriesInRange(userId, date, date),
    getGoalsForUser(userId),
  ]);

  const totals = roundMacroTotals(sumMacros(entries));
  const comparison = buildComparison(totals, goals);

  const byMealType = Object.fromEntries(
    MEAL_TYPES.map((type) => [type, emptyMacros()]),
  );

  for (const entry of entries) {
    const bucket = byMealType[entry.mealType];
    bucket.calories += entry.calories || 0;
    bucket.protein += entry.protein || 0;
    bucket.carbs += entry.carbs || 0;
    bucket.fat += entry.fat || 0;
  }

  for (const type of MEAL_TYPES) {
    byMealType[type] = roundMacroTotals(byMealType[type]);
  }

  return {
    date,
    totals,
    goals,
    comparison,
    byMealType,
  };
}

export async function getWeeklyReport(userId, startDate, endDate) {
  const [entries, goals] = await Promise.all([
    fetchEntriesInRange(userId, startDate, endDate),
    getGoalsForUser(userId),
  ]);

  const days = buildDailyBuckets(entries, startDate, endDate).map((day) => ({
    date: day.date,
    calories: day.calories,
    protein: day.protein,
    carbs: day.carbs,
    fat: day.fat,
  }));

  const totals = roundMacroTotals(sumMacros(entries));

  return {
    range: { startDate, endDate },
    days,
    totals,
    goals,
    comparison: buildComparison(totals, goals),
  };
}

export async function getMacrosReport(userId, startDate, endDate) {
  const [entries, goals] = await Promise.all([
    fetchEntriesInRange(userId, startDate, endDate),
    getGoalsForUser(userId),
  ]);

  const daily = buildDailyBuckets(entries, startDate, endDate).map((day) => ({
    date: day.date,
    protein: day.protein,
    carbs: day.carbs,
    fat: day.fat,
    calories: day.calories,
  }));

  const totals = roundMacroTotals(sumMacros(entries));
  const dayCount = daily.length || 1;

  // Average daily targets help chart "goal vs actual" across a multi-day range.
  const averageDailyActual = {
    calories: roundNutrient(totals.calories / dayCount),
    protein: roundNutrient(totals.protein / dayCount),
    carbs: roundNutrient(totals.carbs / dayCount),
    fat: roundNutrient(totals.fat / dayCount),
  };

  return {
    range: { startDate, endDate },
    daily,
    totals,
    averageDailyActual,
    goals,
    comparison: buildComparison(averageDailyActual, goals),
  };
}

export async function getMicrosReport(userId, startDate, endDate) {
  const entries = await fetchEntriesInRange(userId, startDate, endDate);
  const daily = buildDailyBuckets(entries, startDate, endDate).map((day) => ({
    date: day.date,
    vitaminA: day.vitaminA,
    vitaminC: day.vitaminC,
    vitaminD: day.vitaminD,
    calcium: day.calcium,
    iron: day.iron,
  }));

  return {
    range: { startDate, endDate },
    totals: roundMicroTotals(sumMicros(entries)),
    daily,
  };
}

function shiftUtcDateString(dateStr, dayDelta) {
  const date = startOfUtcDay(dateStr);
  date.setUTCDate(date.getUTCDate() + dayDelta);
  return toUtcDateString(date);
}

function countConsecutiveDaysBackward(daySet, startDate) {
  let streak = 0;
  let cursor = startDate;

  while (daySet.has(cursor)) {
    streak += 1;
    cursor = shiftUtcDateString(cursor, -1);
  }

  return streak;
}

function longestConsecutiveStreak(sortedDays) {
  if (sortedDays.length === 0) {
    return 0;
  }

  let longest = 1;
  let run = 1;

  for (let i = 1; i < sortedDays.length; i += 1) {
    const prev = sortedDays[i - 1];
    const curr = sortedDays[i];
    if (curr === shiftUtcDateString(prev, 1)) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  return longest;
}

/**
 * Meal logging streak for one user (UTC calendar days via consumedAt).
 * A day counts when the user has ≥1 FoodEntry that day.
 * If today has no meal yet, current streak may still continue from yesterday.
 */
export async function getStreakReport(userId) {
  const entries = await prisma.foodEntry.findMany({
    where: { userId },
    select: { consumedAt: true },
    orderBy: { consumedAt: "asc" },
  });

  const daySet = new Set(
    entries.map((entry) => toUtcDateString(entry.consumedAt)),
  );
  const sortedDays = [...daySet].sort();

  const today = todayUtcDateString();
  const yesterday = shiftUtcDateString(today, -1);

  let currentStreak = 0;
  if (daySet.has(today)) {
    currentStreak = countConsecutiveDaysBackward(daySet, today);
  } else if (daySet.has(yesterday)) {
    currentStreak = countConsecutiveDaysBackward(daySet, yesterday);
  }

  return {
    currentStreak,
    longestStreak: longestConsecutiveStreak(sortedDays),
  };
}
