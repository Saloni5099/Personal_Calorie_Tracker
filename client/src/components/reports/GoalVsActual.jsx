import { Link } from "react-router-dom";
import { formatNumber, progressPercent } from "../../utils/format.js";

const ROWS = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    actualKey: "calories",
    goalKey: "dailyCalories",
    remainingKey: "caloriesRemaining",
    excessKey: "caloriesExcess",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    actualKey: "protein",
    goalKey: "proteinTarget",
    remainingKey: "proteinRemaining",
    excessKey: "proteinExcess",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    actualKey: "carbs",
    goalKey: "carbsTarget",
    remainingKey: "carbsRemaining",
    excessKey: "carbsExcess",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    actualKey: "fat",
    goalKey: "fatTarget",
    remainingKey: "fatRemaining",
    excessKey: "fatExcess",
  },
];

function statusLabel(remaining, excess) {
  if (Number(excess) > 0) {
    return { text: "Over goal", className: "text-warning" };
  }
  if (Number(remaining) === 0) {
    return { text: "On target", className: "text-primary" };
  }
  if (Number(remaining) > 0) {
    return { text: "Below goal", className: "text-muted" };
  }
  return { text: "—", className: "text-muted" };
}

export function GoalVsActual({ averages, goals, comparison }) {
  if (!goals) {
    return (
      <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Goal vs actual
        </h2>
        <p className="mt-3 text-sm text-muted">
          Goals are not configured yet, so target comparisons are unavailable.
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
        Average daily intake compared with your daily targets.
      </p>

      <div className="mt-5 space-y-4">
        {ROWS.map((row) => {
          const actual = averages?.[row.actualKey] ?? 0;
          const goal = goals?.[row.goalKey] ?? 0;
          const remaining = comparison?.[row.remainingKey];
          const excess = comparison?.[row.excessKey];
          const percent = progressPercent(actual, goal);
          const isOver = Number(excess) > 0;
          const status = statusLabel(remaining, excess);

          return (
            <div key={row.key}>
              <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <p className="font-medium text-ink">{row.label}</p>
                <p className="text-muted">
                  <span className="font-semibold text-ink">
                    {formatNumber(actual, actual % 1 === 0 ? 0 : 1)}
                  </span>
                  {" / "}
                  {formatNumber(goal, goal % 1 === 0 ? 0 : 1)} {row.unit}
                  <span className={`ml-2 text-xs font-semibold ${status.className}`}>
                    {status.text}
                  </span>
                </p>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-primary-soft"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label={`${row.label} goal comparison`}
              >
                <div
                  className={`h-full rounded-full ${isOver ? "bg-warning" : "bg-primary"}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted">
                {isOver
                  ? `${formatNumber(excess, excess % 1 === 0 ? 0 : 1)} ${row.unit} over`
                  : `${formatNumber(remaining, remaining % 1 === 0 ? 0 : 1)} ${row.unit} remaining`}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
