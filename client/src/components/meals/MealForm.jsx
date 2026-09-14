import { useEffect, useState } from "react";
import { Alert } from "../ui/Alert.jsx";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import {
  MEAL_TYPE_OPTIONS,
  emptyMealFormValues,
  mealToFormValues,
  validateMealForm,
} from "./mealFormUtils.js";

export function MealForm({
  mode = "create",
  meal = null,
  open,
  onClose,
  onSubmit,
  submitting = false,
  apiError = "",
  estimateNotice = "",
}) {
  const [values, setValues] = useState(emptyMealFormValues());
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setFieldErrors({});
    setValues(meal ? mealToFormValues(meal) : emptyMealFormValues());
  }, [open, meal]);

  if (!open) return null;

  function updateField(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { isValid, errors, payload } = validateMealForm(values);
    setFieldErrors(errors);
    if (!isValid) return;
    await onSubmit(payload);
  }

  const title =
    mode === "edit"
      ? "Edit meal"
      : estimateNotice
        ? "Review AI meal"
        : "Add meal";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="meal-form-title">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close meal form"
        onClick={onClose}
        disabled={submitting}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-lg sm:rounded-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="meal-form-title" className="font-display text-xl font-semibold text-ink">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Nutrition values are saved to your meal log after you confirm.
            </p>
          </div>
          <Button type="button" variant="ghost" onClick={onClose} disabled={submitting}>
            Close
          </Button>
        </div>

        {estimateNotice ? (
          <div className="mb-4">
            <Alert tone="info" title="AI estimate">
              {estimateNotice}
            </Alert>
          </div>
        ) : null}

        {apiError ? (
          <div className="mb-4">
            <Alert title="Couldn’t save meal">{apiError}</Alert>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            id="foodName"
            label="Food name"
            value={values.foodName}
            onChange={(event) => updateField("foodName", event.target.value)}
            error={fieldErrors.foodName}
            disabled={submitting}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="mealType" className="block text-sm font-medium text-ink">
                Meal type
              </label>
              <select
                id="mealType"
                value={values.mealType}
                onChange={(event) => updateField("mealType", event.target.value)}
                disabled={submitting}
                className={`w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink ${
                  fieldErrors.mealType ? "border-danger" : "border-line"
                }`}
              >
                {MEAL_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.mealType ? (
                <p className="text-xs text-danger" role="alert">
                  {fieldErrors.mealType}
                </p>
              ) : null}
            </div>

            <Input
              id="consumedAt"
              label="Consumed date/time"
              type="datetime-local"
              value={values.consumedAt}
              onChange={(event) => updateField("consumedAt", event.target.value)}
              error={fieldErrors.consumedAt}
              disabled={submitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="quantity"
              label="Quantity"
              type="number"
              min="0"
              step="any"
              value={values.quantity}
              onChange={(event) => updateField("quantity", event.target.value)}
              error={fieldErrors.quantity}
              disabled={submitting}
            />
            <Input
              id="unit"
              label="Unit"
              value={values.unit}
              onChange={(event) => updateField("unit", event.target.value)}
              error={fieldErrors.unit}
              disabled={submitting}
              hint='Examples: g, ml, cup, piece'
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              id="calories"
              label="Calories"
              type="number"
              min="0"
              step="any"
              value={values.calories}
              onChange={(event) => updateField("calories", event.target.value)}
              error={fieldErrors.calories}
              disabled={submitting}
            />
            <Input
              id="protein"
              label="Protein (g)"
              type="number"
              min="0"
              step="any"
              value={values.protein}
              onChange={(event) => updateField("protein", event.target.value)}
              error={fieldErrors.protein}
              disabled={submitting}
            />
            <Input
              id="carbs"
              label="Carbs (g)"
              type="number"
              min="0"
              step="any"
              value={values.carbs}
              onChange={(event) => updateField("carbs", event.target.value)}
              error={fieldErrors.carbs}
              disabled={submitting}
            />
            <Input
              id="fat"
              label="Fat (g)"
              type="number"
              min="0"
              step="any"
              value={values.fat}
              onChange={(event) => updateField("fat", event.target.value)}
              error={fieldErrors.fat}
              disabled={submitting}
            />
          </div>

          <fieldset className="rounded-lg border border-line p-4">
            <legend className="px-1 text-sm font-semibold text-ink">
              Micronutrients (optional)
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                id="vitaminA"
                label="Vitamin A"
                type="number"
                min="0"
                step="any"
                value={values.vitaminA}
                onChange={(event) => updateField("vitaminA", event.target.value)}
                error={fieldErrors.vitaminA}
                disabled={submitting}
              />
              <Input
                id="vitaminC"
                label="Vitamin C"
                type="number"
                min="0"
                step="any"
                value={values.vitaminC}
                onChange={(event) => updateField("vitaminC", event.target.value)}
                error={fieldErrors.vitaminC}
                disabled={submitting}
              />
              <Input
                id="vitaminD"
                label="Vitamin D"
                type="number"
                min="0"
                step="any"
                value={values.vitaminD}
                onChange={(event) => updateField("vitaminD", event.target.value)}
                error={fieldErrors.vitaminD}
                disabled={submitting}
              />
              <Input
                id="calcium"
                label="Calcium"
                type="number"
                min="0"
                step="any"
                value={values.calcium}
                onChange={(event) => updateField("calcium", event.target.value)}
                error={fieldErrors.calcium}
                disabled={submitting}
              />
              <Input
                id="iron"
                label="Iron"
                type="number"
                min="0"
                step="any"
                value={values.iron}
                onChange={(event) => updateField("iron", event.target.value)}
                error={fieldErrors.iron}
                disabled={submitting}
              />
            </div>
          </fieldset>

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {mode === "edit" ? "Save changes" : "Save meal"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
