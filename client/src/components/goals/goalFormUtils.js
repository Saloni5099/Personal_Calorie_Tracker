export function emptyGoalFormValues() {
  return {
    dailyCalories: "",
    proteinTarget: "",
    carbsTarget: "",
    fatTarget: "",
    weightGoal: "",
  };
}

export function goalToFormValues(goal) {
  return {
    dailyCalories: goal.dailyCalories ?? "",
    proteinTarget: goal.proteinTarget ?? "",
    carbsTarget: goal.carbsTarget ?? "",
    fatTarget: goal.fatTarget ?? "",
    weightGoal: goal.weightGoal ?? "",
  };
}

function parseRequiredNumber(value, field, label, errors, { allowZero = false } = {}) {
  if (value === "" || value === null || value === undefined) {
    errors[field] = `${label} is required.`;
    return null;
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    errors[field] = `${label} must be a number.`;
    return null;
  }

  if (allowZero) {
    if (num < 0) {
      errors[field] = `${label} cannot be negative.`;
      return null;
    }
  } else if (num <= 0) {
    errors[field] = `${label} must be greater than 0.`;
    return null;
  }

  return num;
}

export function validateGoalForm(values) {
  const errors = {};

  const dailyCalories = parseRequiredNumber(
    values.dailyCalories,
    "dailyCalories",
    "Daily calories",
    errors,
  );
  const proteinTarget = parseRequiredNumber(
    values.proteinTarget,
    "proteinTarget",
    "Protein target",
    errors,
    { allowZero: true },
  );
  const carbsTarget = parseRequiredNumber(
    values.carbsTarget,
    "carbsTarget",
    "Carbohydrates target",
    errors,
    { allowZero: true },
  );
  const fatTarget = parseRequiredNumber(
    values.fatTarget,
    "fatTarget",
    "Fat target",
    errors,
    { allowZero: true },
  );

  let weightGoal = null;
  if (values.weightGoal !== "" && values.weightGoal !== null && values.weightGoal !== undefined) {
    const num = Number(values.weightGoal);
    if (Number.isNaN(num)) {
      errors.weightGoal = "Weight goal must be a number.";
    } else if (num <= 0) {
      errors.weightGoal = "Weight goal must be greater than 0.";
    } else {
      weightGoal = num;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  return {
    isValid,
    errors,
    payload: isValid
      ? {
          dailyCalories,
          proteinTarget,
          carbsTarget,
          fatTarget,
          weightGoal,
        }
      : null,
  };
}
