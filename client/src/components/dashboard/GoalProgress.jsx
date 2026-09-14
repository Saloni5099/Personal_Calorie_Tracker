import { Link } from "react-router-dom";
import { formatNumber, progressPercent } from "../../utils/format.js";

const ROWS = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    actualKey: "calories",
    goalKey: "dailyCalories",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    actualKey: "protein",
    goalKey: "proteinTarget",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    actualKey: "carbs",
    goalKey: "carbsTarget",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    actualKey: "fat",
    goalKey: "fatTarget",
  },
];

export function GoalProgress({ totals, goals }) {
  if (!goals) {
    return (
      <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Goal vs actual
        </h2>
        <p className="mt-3 text-sm text-muted">
          You haven&apos;t set nutrition goals yet. Add targets to compare your
          daily intake.
        </p>
        <Link
          to="/goals"
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
        >
          Set your goals
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Goal vs actual
      </h2>
      <p className="mt-1 text-sm text-muted">
        Today&apos;s intake compared with your targets.
      </p>

      <div className="mt-5 space-y-4">
        {ROWS.map((row) => {
          const actual = totals?.[row.actualKey] ?? 0;
          const goal = goals?.[row.goalKey] ?? 0;
          const percent = progressPercent(actual, goal);
          const isOver = actual > goal;

          return (
            <div key={row.key}>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
                <p className="font-medium text-ink">{row.label}</p>
                <p className="text-muted">
                  <span className="font-semibold text-ink">
                    {formatNumber(actual, actual % 1 === 0 ? 0 : 1)}
                  </span>
                  {" / "}
                  {formatNumber(goal, goal % 1 === 0 ? 0 : 1)} {row.unit}
                </p>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-primary-soft"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={`${row.label} goal progress`}
              >
                <div
                  className={`h-full rounded-full ${isOver ? "bg-warning" : "bg-primary"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
