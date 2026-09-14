import { Button } from "../ui/Button.jsx";
import { formatNumber } from "../../utils/format.js";

const ITEMS = [
  {
    key: "dailyCalories",
    label: "Daily calories",
    unit: "kcal/day",
  },
  {
    key: "proteinTarget",
    label: "Protein",
    unit: "g/day",
  },
  {
    key: "carbsTarget",
    label: "Carbohydrates",
    unit: "g/day",
  },
  {
    key: "fatTarget",
    label: "Fat",
    unit: "g/day",
  },
];

export function GoalSummary({ goal, onEdit }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Your nutrition goals
          </h2>
          <p className="mt-1 text-sm text-muted">
            These targets power goal comparisons on Dashboard and Reports.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={onEdit}>
          Edit goals
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <article
            key={item.key}
            className="rounded-lg border border-line bg-canvas/50 px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {item.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              {formatNumber(goal[item.key], goal[item.key] % 1 === 0 ? 0 : 1)}
            </p>
            <p className="mt-1 text-xs text-muted">{item.unit}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-line bg-canvas/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Weight goal
        </p>
        <p className="mt-2 font-display text-xl font-semibold text-ink">
          {goal.weightGoal == null
            ? "Not set"
            : `${formatNumber(goal.weightGoal, goal.weightGoal % 1 === 0 ? 0 : 1)} kg`}
        </p>
      </div>
    </section>
  );
}
