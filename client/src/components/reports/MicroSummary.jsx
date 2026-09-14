import { formatNumber } from "../../utils/format.js";

const MICROS = [
  { key: "vitaminA", label: "Vitamin A" },
  { key: "vitaminC", label: "Vitamin C" },
  { key: "vitaminD", label: "Vitamin D" },
  { key: "calcium", label: "Calcium" },
  { key: "iron", label: "Iron" },
];

export function MicroSummary({ totals, daily }) {
  const hasLoggedMicros = MICROS.some((micro) => Number(totals?.[micro.key] || 0) > 0);

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Micronutrient summary
      </h2>
      <p className="mt-1 text-sm text-muted">
        Period totals from logged values only. Meals without a micronutrient
        recorded do not invent zeros for that nutrient.
      </p>

      {!hasLoggedMicros ? (
        <p className="mt-5 rounded-lg border border-dashed border-line bg-canvas/60 px-4 py-6 text-sm text-muted">
          No micronutrients were logged in this range yet.
        </p>
      ) : (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-lg border border-line md:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line bg-canvas/70 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nutrient</th>
                  <th className="px-4 py-3 font-semibold">Period total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {MICROS.map((micro) => (
                  <tr key={micro.key}>
                    <td className="px-4 py-3 font-medium text-ink">{micro.label}</td>
                    <td className="px-4 py-3 text-muted">
                      {formatNumber(totals?.[micro.key] ?? 0, 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:hidden">
            {MICROS.map((micro) => (
              <article
                key={micro.key}
                className="rounded-lg border border-line bg-canvas/50 px-4 py-3"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {micro.label}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">
                  {formatNumber(totals?.[micro.key] ?? 0, 1)}
                </p>
              </article>
            ))}
          </div>

          {daily?.length ? (
            <details className="mt-5 rounded-lg border border-line bg-canvas/40 p-4">
              <summary className="cursor-pointer text-sm font-semibold text-ink">
                Daily micronutrient breakdown
              </summary>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {daily.map((day) => (
                  <li key={day.date} className="rounded-md bg-surface px-3 py-2">
                    <p className="font-medium text-ink">{day.date}</p>
                    <p className="mt-1 text-xs">
                      A {formatNumber(day.vitaminA, 1)} · C{" "}
                      {formatNumber(day.vitaminC, 1)} · D{" "}
                      {formatNumber(day.vitaminD, 1)} · Ca{" "}
                      {formatNumber(day.calcium, 1)} · Fe{" "}
                      {formatNumber(day.iron, 1)}
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </>
      )}
    </section>
  );
}
