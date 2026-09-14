import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";

export function ReportFilters({
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
      <h2 className="font-display text-base font-semibold text-ink">
        Date range
      </h2>
      <p className="mt-1 text-sm text-muted">
        Dates use UTC calendar days, matching the Meals and Reports APIs.
      </p>

      <form
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          onApply();
        }}
      >
        <Input
          id="reportStartDate"
          label="Start date"
          type="date"
          value={values.startDate}
          onChange={(event) => updateField("startDate", event.target.value)}
          disabled={disabled}
        />
        <Input
          id="reportEndDate"
          label="End date"
          type="date"
          value={values.endDate}
          onChange={(event) => updateField("endDate", event.target.value)}
          disabled={disabled}
        />
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-2">
          <Button type="submit" disabled={disabled} className="flex-1">
            Apply
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={disabled}
            onClick={onReset}
          >
            Reset to last 7 days
          </Button>
        </div>
      </form>
    </section>
  );
}
