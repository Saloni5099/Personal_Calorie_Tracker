import { formatNumber, progressPercent } from "../../utils/format.js";

function MacroCard({ label, actual, goal, unit = "g" }) {
  const hasGoal = goal != null;
  const excess = hasGoal ? Math.max(0, actual - goal) : 0;
  const isOver = excess > 0;
  const percent = hasGoal ? progressPercent(actual, goal) : 0;

  return (
    <article className="rounded-xl border border-line bg-surface p-4 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">
        {formatNumber(actual, actual % 1 === 0 ? 0 : 1)}
        <span className="ml-1 text-sm font-medium text-muted">{unit}</span>
      </p>
      {hasGoal ? (
        <>
          <p className="mt-1 text-sm text-muted">
            of {formatNumber(goal, goal % 1 === 0 ? 0 : 1)}
            {unit}
          </p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-primary-soft"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label={`${label} progress`}
          >
            <div
              className={`h-full rounded-full ${isOver ? "bg-warning" : "bg-primary"}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          {isOver ? (
            <p className="mt-2 text-xs font-medium text-warning">
              {formatNumber(excess, excess % 1 === 0 ? 0 : 1)}
              {unit} over
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-2 text-xs text-muted">No goal set</p>
      )}
    </article>
  );
}

export function MacroSummary({ totals, goals }) {
  return (
    <section aria-label="Macro summary" className="grid gap-3 sm:grid-cols-3">
      <MacroCard
        label="Protein"
        actual={totals?.protein ?? 0}
        goal={goals?.proteinTarget ?? null}
      />
      <MacroCard
        label="Carbs"
        actual={totals?.carbs ?? 0}
        goal={goals?.carbsTarget ?? null}
      />
      <MacroCard
        label="Fat"
        actual={totals?.fat ?? 0}
        goal={goals?.fatTarget ?? null}
      />
    </section>
  );
}
