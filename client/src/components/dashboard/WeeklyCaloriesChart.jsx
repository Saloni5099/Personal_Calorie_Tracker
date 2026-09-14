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

  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-sm">
      <p className="font-medium text-ink">{formatShortWeekday(label)}</p>
      <p className="mt-1 text-muted">
        {formatNumber(payload[0].value)} kcal
      </p>
    </div>
  );
}

export function WeeklyCaloriesChart({ days, calorieGoal }) {
  const data = (days || []).map((day) => ({
    date: day.date,
    calories: day.calories ?? 0,
    label: formatShortWeekday(day.date),
  }));

  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold text-ink">
          Weekly calorie trend
        </h2>
        <p className="mt-1 text-sm text-muted">
          Daily totals for the last 7 UTC days
          {calorieGoal != null
            ? ` · goal ${formatNumber(calorieGoal)} kcal`
            : ""}
          .
        </p>
      </div>

      <div className="h-64 w-full min-w-0" role="img" aria-label="Weekly calorie line chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              width={40}
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
              name="Calories"
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
    </section>
  );
}
