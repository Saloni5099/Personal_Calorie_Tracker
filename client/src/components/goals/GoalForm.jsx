import { useEffect, useState } from "react";
import { Alert } from "../ui/Alert.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import {
  emptyGoalFormValues,
  goalToFormValues,
  validateGoalForm,
} from "./goalFormUtils.js";

export function GoalForm({
  mode = "create",
  goal = null,
  onSubmit,
  onCancel,
  submitting = false,
  apiError = "",
}) {
  const [values, setValues] = useState(emptyGoalFormValues());
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    setFieldErrors({});
    setValues(goal ? goalToFormValues(goal) : emptyGoalFormValues());
  }, [goal, mode]);

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { isValid, errors, payload } = validateGoalForm(values);
    setFieldErrors(errors);
    if (!isValid) return;
    await onSubmit(payload);
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        {mode === "edit" ? "Edit goals" : "Set your goals"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        These targets are used on the Dashboard and Reports for goal comparisons.
      </p>

      {apiError ? (
        <div className="mt-4">
          <Alert title="Couldn’t save goals">{apiError}</Alert>
        </div>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="dailyCalories"
            label="Daily calories (kcal/day)"
            type="number"
            min="0"
            step="any"
            value={values.dailyCalories}
            onChange={(event) => updateField("dailyCalories", event.target.value)}
            error={fieldErrors.dailyCalories}
            disabled={submitting}
          />
          <Input
            id="proteinTarget"
            label="Protein target (g/day)"
            type="number"
            min="0"
            step="any"
            value={values.proteinTarget}
            onChange={(event) => updateField("proteinTarget", event.target.value)}
            error={fieldErrors.proteinTarget}
            disabled={submitting}
          />
          <Input
            id="carbsTarget"
            label="Carbohydrates target (g/day)"
            type="number"
            min="0"
            step="any"
            value={values.carbsTarget}
            onChange={(event) => updateField("carbsTarget", event.target.value)}
            error={fieldErrors.carbsTarget}
            disabled={submitting}
          />
          <Input
            id="fatTarget"
            label="Fat target (g/day)"
            type="number"
            min="0"
            step="any"
            value={values.fatTarget}
            onChange={(event) => updateField("fatTarget", event.target.value)}
            error={fieldErrors.fatTarget}
            disabled={submitting}
          />
          <Input
            id="weightGoal"
            label="Weight goal (kg, optional)"
            type="number"
            min="0"
            step="any"
            value={values.weightGoal}
            onChange={(event) => updateField("weightGoal", event.target.value)}
            error={fieldErrors.weightGoal}
            disabled={submitting}
            hint="Leave blank if you don’t want a weight target."
            className="sm:col-span-2"
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          {mode === "edit" && onCancel ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          ) : null}
          <Button type="submit" loading={submitting}>
            {mode === "edit" ? "Update goals" : "Save goals"}
          </Button>
        </div>
      </form>
    </section>
  );
}
