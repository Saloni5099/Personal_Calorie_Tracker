import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, formatShortWeekday } from "../../utils/format.js";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const calories = payload.find((item) => item.dataKey === "calories")?.value ?? 0;
  const goal = payload.find((item) => item.dataKey === "goal")?.value;

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-ink">{formatShortWeekday(label)}</p>
      <p className="mt-1 text-muted">{formatNumber(calories)} kcal actual</p>
      {goal != null ? (
        <p className="text-muted">{formatNumber(goal)} kcal goal</p>
      ) : null}
    </div>
  );
}

export function CalorieTrendChart({ days, calorieGoal, rangeLabel }) {
  const data = (days || []).map((day) => ({
    date: day.date,
    calories: day.calories ?? 0,
    goal: calorieGoal ?? null,
    label: formatShortWeekday(day.date),
  }));

  const hasAnyIntake = data.some((day) => day.calories > 0);

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink">
          Calorie trend
        </h2>
        <p className="mt-1 text-sm text-muted">
          Daily calories{rangeLabel ? ` · ${rangeLabel}` : ""}
          {calorieGoal != null
            ? ` · daily goal ${formatNumber(calorieGoal)} kcal`
            : ""}
          .
        </p>
      </div>

      {!data.length ? (
        <p className="rounded-lg border border-dashed border-line bg-canvas/60 px-4 py-8 text-sm text-muted">
          No days available for this range.
        </p>
      ) : !hasAnyIntake ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-dashed border-line bg-canvas/60 px-4 py-6 text-sm text-muted">
            No calories logged in this period. Days still appear as 0 so the
            trend stays complete.
          </p>
          <ChartBody data={data} calorieGoal={calorieGoal} />
        </div>
      ) : (
        <ChartBody data={data} calorieGoal={calorieGoal} />
      )}
    </section>
  );
}

function ChartBody({ data, calorieGoal }) {
  return (
    <>
      <div
        className="h-72 w-full min-w-0"
        role="img"
        aria-label="Calorie trend line chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#d7e0db" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => formatShortWeekday(value).split(",")[0]}
              tick={{ fill: "#5b6b64", fontSize: 12 }}
              axisLine={{ stroke: "#d7e0db" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#5b6b64", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<ChartTooltip />} />
            {calorieGoal != null ? (
              <ReferenceLine
                y={calorieGoal}
                stroke="#9a6700"
                strokeDasharray="4 4"
                label={{
                  value: "Goal",
                  position: "insideTopRight",
                  fill: "#9a6700",
                  fontSize: 11,
                }}
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="calories"
              name="Actual"
              stroke="#1f6b57"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#1f6b57" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted sm:grid-cols-4 lg:grid-cols-7">
        {data.map((day) => (
          <li key={day.date} className="rounded-md bg-canvas px-2 py-1.5">
            <span className="block font-medium text-ink">{day.label}</span>
            {formatNumber(day.calories)} kcal
          </li>
        ))}
      </ul>
    </>
  );
}
