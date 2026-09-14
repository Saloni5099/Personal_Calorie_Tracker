import { Link } from "react-router-dom";
import { formatNumber, formatTimeUtc } from "../../utils/format.js";

const GROUPS = [
  { key: "BREAKFAST", label: "Breakfast" },
  { key: "LUNCH", label: "Lunch" },
  { key: "DINNER", label: "Dinner" },
  { key: "SNACK", label: "Snacks" },
];

export function MealSummary({ meals, byMealType }) {
  const grouped = Object.fromEntries(GROUPS.map((g) => [g.key, []]));
  for (const meal of meals) {
    if (grouped[meal.mealType]) {
      grouped[meal.mealType].push(meal);
    }
  }

  const hasAny = meals.length > 0;

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">
            Today&apos;s meals
          </h2>
          <p className="mt-1 text-sm text-muted">
            Logged entries for today, grouped by meal.
          </p>
        </div>
        <Link
          to="/meals"
          className="shrink-0 text-sm font-semibold text-primary hover:text-primary-hover"
        >
          View meals
        </Link>
      </div>

      {!hasAny ? (
        <div className="mt-6 rounded-lg border border-dashed border-line bg-canvas/60 px-4 py-6">
          <p className="font-medium text-ink">Your day is empty.</p>
          <p className="mt-1 text-sm text-muted">
            Add your first meal to start tracking.
          </p>
          <Link
            to="/meals"
            className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-primary-hover"
          >
            Go to Meals
          </Link>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {GROUPS.map((group) => {
            const items = grouped[group.key];
            const typeTotal = byMealType?.[group.key]?.calories ?? 0;

            return (
              <div key={group.key}>
                <div className="mb-2 flex items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink">
                    {group.label}
                  </h3>
                  <p className="text-xs text-muted">
                    {formatNumber(typeTotal)} kcal
                  </p>
                </div>

                {items.length === 0 ? (
                  <p className="rounded-lg bg-canvas px-3 py-2 text-sm text-muted">
                    No {group.label.toLowerCase()} logged yet.
                  </p>
                ) : (
                  <ul className="divide-y divide-line rounded-lg border border-line">
                    {items.map((meal) => (
                      <li
                        key={meal.id}
                        className="flex items-start justify-between gap-3 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-ink">
                            {meal.foodName}
                          </p>
                          <p className="text-xs text-muted">
                            {formatNumber(meal.quantity, meal.quantity % 1 === 0 ? 0 : 1)}{" "}
                            {meal.unit}
                            {meal.consumedAt
                              ? ` · ${formatTimeUtc(meal.consumedAt)} UTC`
                              : ""}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-semibold text-ink">
                          {formatNumber(meal.calories)} kcal
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
