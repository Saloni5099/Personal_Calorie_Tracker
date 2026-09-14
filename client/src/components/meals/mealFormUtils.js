export const MEAL_TYPE_OPTIONS = [
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "LUNCH", label: "Lunch" },
  { value: "DINNER", label: "Dinner" },
  { value: "SNACK", label: "Snack" },
];

export function mealTypeLabel(value) {
  return MEAL_TYPE_OPTIONS.find((option) => option.value === value)?.label || value;
}

export function toDatetimeLocalValue(isoString = new Date().toISOString()) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return toDatetimeLocalValue(new Date().toISOString());
  }

  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export function emptyMealFormValues() {
  return {
    foodName: "",
    mealType: "BREAKFAST",
    quantity: "",
    unit: "g",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    vitaminA: "",
    vitaminC: "",
    vitaminD: "",
    calcium: "",
    iron: "",
    consumedAt: toDatetimeLocalValue(),
  };
}

export function mealToFormValues(meal) {
  return {
    foodName: meal.foodName ?? "",
    mealType: meal.mealType ?? "BREAKFAST",
    quantity: meal.quantity ?? "",
    unit: meal.unit ?? "g",
    calories: meal.calories ?? "",
    protein: meal.protein ?? "",
    carbs: meal.carbs ?? "",
    fat: meal.fat ?? "",
    vitaminA: meal.vitaminA ?? "",
    vitaminC: meal.vitaminC ?? "",
    vitaminD: meal.vitaminD ?? "",
    calcium: meal.calcium ?? "",
    iron: meal.iron ?? "",
    consumedAt: toDatetimeLocalValue(meal.consumedAt),
  };
}

function parseRequiredNumber(value, label, errors) {
  if (value === "" || value === null || value === undefined) {
    errors[label] = `${label} is required.`;
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    errors[label] = `${label} must be a number.`;
    return null;
  }
  return num;
}

function parseOptionalNumber(value, label, errors) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    errors[label] = `${label} must be a number.`;
    return null;
  }
  if (num < 0) {
    errors[label] = `${label} cannot be negative.`;
    return null;
  }
  return num;
}

export function validateMealForm(values) {
  const errors = {};

  if (!values.foodName.trim()) {
    errors.foodName = "Food name is required.";
  }

  if (!values.mealType) {
    errors.mealType = "Meal type is required.";
  }

  if (!values.unit.trim()) {
    errors.unit = "Unit is required.";
  }

  const quantity = parseRequiredNumber(values.quantity, "quantity", errors);
  if (quantity !== null && quantity <= 0) {
    errors.quantity = "Quantity must be greater than 0.";
  }

  const calories = parseRequiredNumber(values.calories, "calories", errors);
  if (calories !== null && calories < 0) {
    errors.calories = "Calories cannot be negative.";
  }

  const protein = parseRequiredNumber(values.protein, "protein", errors);
  if (protein !== null && protein < 0) {
    errors.protein = "Protein cannot be negative.";
  }

  const carbs = parseRequiredNumber(values.carbs, "carbs", errors);
  if (carbs !== null && carbs < 0) {
    errors.carbs = "Carbs cannot be negative.";
  }

  const fat = parseRequiredNumber(values.fat, "fat", errors);
  if (fat !== null && fat < 0) {
    errors.fat = "Fat cannot be negative.";
  }

  const consumedAtIso = fromDatetimeLocalValue(values.consumedAt);
  if (!values.consumedAt || !consumedAtIso) {
    errors.consumedAt = "Consumed date/time is required.";
  }

  const vitaminA = parseOptionalNumber(values.vitaminA, "vitaminA", errors);
  const vitaminC = parseOptionalNumber(values.vitaminC, "vitaminC", errors);
  const vitaminD = parseOptionalNumber(values.vitaminD, "vitaminD", errors);
  const calcium = parseOptionalNumber(values.calcium, "calcium", errors);
  const iron = parseOptionalNumber(values.iron, "iron", errors);

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    payload: isValid
      ? {
          foodName: values.foodName.trim(),
          mealType: values.mealType,
          quantity,
          unit: values.unit.trim(),
          calories,
          protein,
          carbs,
          fat,
          vitaminA,
          vitaminC,
          vitaminD,
          calcium,
          iron,
          consumedAt: consumedAtIso,
        }
      : null,
  };
}
