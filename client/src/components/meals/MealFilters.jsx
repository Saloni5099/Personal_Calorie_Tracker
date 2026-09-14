import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { MEAL_TYPE_OPTIONS } from "./mealFormUtils.js";

export function MealFilters({
  values,
  onChange,
  onApply,
  onReset,
  disabled = false,
}) {
  function updateField(field, value) {
    onChange({ ...values, [field]: value });
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <h2 className="font-display text-base font-semibold text-ink">Filters</h2>
      <p className="mt-1 text-sm text-muted">
        Filter meals on the server by date range and meal type.
      </p>

      <form
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <Input
          id="startDate"
          label="Start date"
          type="date"
          value={values.startDate}
          onChange={(event) => updateField("startDate", event.target.value)}
          disabled={disabled}
        />
        <Input
          id="endDate"
          label="End date"
          type="date"
          value={values.endDate}
          onChange={(event) => updateField("endDate", event.target.value)}
          disabled={disabled}
        />
        <div className="space-y-1.5">
          <label htmlFor="mealTypeFilter" className="block text-sm font-medium text-ink">
            Meal type
          </label>
          <select
            id="mealTypeFilter"
            value={values.mealType}
            onChange={(event) => updateField("mealType", event.target.value)}
            disabled={disabled}
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink"
          >
            <option value="">All meals</option>
            {MEAL_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-2">
          <Button type="submit" disabled={disabled} className="flex-1">
            Apply
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={onReset}
          >
            Clear
          </Button>
        </div>
      </form>
    </section>
  );
}
