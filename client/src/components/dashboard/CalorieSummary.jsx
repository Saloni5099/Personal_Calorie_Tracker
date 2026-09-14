import { formatNumber } from "../../utils/format.js";

export function CalorieSummary({ totals, goals, comparison }) {
  const consumed = totals?.calories ?? 0;
  const goal = goals?.dailyCalories ?? null;
  const remaining = comparison?.caloriesRemaining;
  const excess = comparison?.caloriesExcess;
  const isOver = goal != null && Number(excess) > 0;

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        Calories today
      </p>

      <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-1">
        <p className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          {formatNumber(consumed)}
        </p>
        <p className="pb-1 text-lg text-muted">kcal</p>
      </div>

      {goal != null ? (
        <>
          <p className="mt-2 text-sm text-muted">
            of {formatNumber(goal)} kcal goal
          </p>
          <p
            className={`mt-4 text-sm font-semibold ${
              isOver ? "text-warning" : "text-primary"
            }`}
          >
            {isOver
              ? `${formatNumber(excess)} kcal over`
              : `${formatNumber(remaining)} kcal remaining`}
          </p>
          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-primary-soft"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(
              100,
              Math.round((consumed / goal) * 100),
            )}
            aria-label="Calorie progress toward daily goal"
          >
            <div
              className={`h-full rounded-full ${
                isOver ? "bg-warning" : "bg-primary"
              }`}
              style={{
                width: `${Math.min(100, Math.round((consumed / goal) * 100))}%`,
              }}
            />
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-muted">
          Set a calorie goal to track remaining intake.
        </p>
      )}
    </section>
  );
}
