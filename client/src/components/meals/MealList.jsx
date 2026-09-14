import { Button } from "../ui/Button.jsx";
import { formatNumber } from "../../utils/format.js";
import { mealTypeLabel } from "./mealFormUtils.js";

function formatConsumed(isoString) {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoString));
}

export function MealList({
  meals,
  onEdit,
  onDelete,
  deletingId = null,
  disabled = false,
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-line bg-surface md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas/70 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Food</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Calories</th>
              <th className="px-4 py-3 font-semibold">Macros</th>
              <th className="px-4 py-3 font-semibold">Consumed</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {meals.map((meal) => (
              <tr key={meal.id} className="align-top">
                <td className="px-4 py-3 font-medium text-ink">{meal.foodName}</td>
                <td className="px-4 py-3 text-muted">{mealTypeLabel(meal.mealType)}</td>
                <td className="px-4 py-3 text-muted">
                  {formatNumber(meal.quantity, meal.quantity % 1 === 0 ? 0 : 1)}{" "}
                  {meal.unit}
                </td>
                <td className="px-4 py-3 font-semibold text-ink">
                  {formatNumber(meal.calories)} kcal
                </td>
                <td className="px-4 py-3 text-muted">
                  P {formatNumber(meal.protein, 1)} · C{" "}
                  {formatNumber(meal.carbs, 1)} · F {formatNumber(meal.fat, 1)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatConsumed(meal.consumedAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 py-1.5"
                      disabled={disabled}
                      onClick={() => onEdit(meal)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="px-3 py-1.5"
                      disabled={disabled}
                      loading={deletingId === meal.id}
                      onClick={() => onDelete(meal)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {meals.map((meal) => (
          <article
            key={meal.id}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-semibold text-ink">{meal.foodName}</h3>
                <p className="mt-1 text-sm text-muted">
                  {mealTypeLabel(meal.mealType)} ·{" "}
                  {formatNumber(meal.quantity, meal.quantity % 1 === 0 ? 0 : 1)}{" "}
                  {meal.unit}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-ink">
                {formatNumber(meal.calories)} kcal
              </p>
            </div>

            <p className="mt-3 text-sm text-muted">
              Protein {formatNumber(meal.protein, 1)}g · Carbs{" "}
              {formatNumber(meal.carbs, 1)}g · Fat {formatNumber(meal.fat, 1)}g
            </p>
            <p className="mt-1 text-xs text-muted">
              {formatConsumed(meal.consumedAt)}
            </p>

            <div className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                disabled={disabled}
                onClick={() => onEdit(meal)}
              >
                Edit
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                disabled={disabled}
                loading={deletingId === meal.id}
                onClick={() => onDelete(meal)}
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
