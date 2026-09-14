import { formatNumber, progressPercent } from "../../utils/format.js";

const MACROS = [
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
    label: "Carbohydrates",
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

export function MacroReport({ averages, totals, goals, comparison }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Macro overview
      </h2>
      <p className="mt-1 text-sm text-muted">
        Average daily intake for the selected range
        {totals
          ? ` · period totals P ${formatNumber(totals.protein, 1)}g / C ${formatNumber(totals.carbs, 1)}g / F ${formatNumber(totals.fat, 1)}g`
          : ""}
        .
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {MACROS.map((macro) => {
          const actual = averages?.[macro.actualKey] ?? 0;
          const goal = goals?.[macro.goalKey] ?? null;
          const remaining = comparison?.[macro.remainingKey];
          const excess = comparison?.[macro.excessKey];
          const isOver = goal != null && Number(excess) > 0;
          const percent = goal != null ? progressPercent(actual, goal) : 0;

          return (
            <article
              key={macro.key}
              className="rounded-lg border border-line bg-canvas/50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {macro.label}
              </p>
              <p className="mt-2 font-display text-2xl font-semibold text-ink">
                {formatNumber(actual, actual % 1 === 0 ? 0 : 1)}
                <span className="ml-1 text-sm font-medium text-muted">
                  {macro.unit}/day
                </span>
              </p>

              {goal != null ? (
                <>
                  <p className="mt-1 text-sm text-muted">
                    Goal {formatNumber(goal, goal % 1 === 0 ? 0 : 1)}
                    {macro.unit}/day
                  </p>
                  <div
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-soft"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    aria-label={`${macro.label} progress`}
                  >
                    <div
                      className={`h-full rounded-full ${isOver ? "bg-warning" : "bg-primary"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p
                    className={`mt-2 text-xs font-medium ${
                      isOver ? "text-warning" : "text-primary"
                    }`}
                  >
                    {isOver
                      ? `${formatNumber(excess, excess % 1 === 0 ? 0 : 1)}${macro.unit} over`
                      : `${formatNumber(remaining, remaining % 1 === 0 ? 0 : 1)}${macro.unit} remaining`}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-xs text-muted">No goal configured</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
