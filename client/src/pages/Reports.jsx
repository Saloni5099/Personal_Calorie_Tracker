import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../api/client.js";
import {
  getMacrosReport,
  getMicrosReport,
  getWeeklyReport,
} from "../api/reportsApi.js";
import { CalorieTrendChart } from "../components/reports/CalorieTrendChart.jsx";
import { GoalVsActual } from "../components/reports/GoalVsActual.jsx";
import { MacroReport } from "../components/reports/MacroReport.jsx";
import { MicroSummary } from "../components/reports/MicroSummary.jsx";
import { ReportFilters } from "../components/reports/ReportFilters.jsx";
import { ReportsSkeleton } from "../components/reports/ReportsSkeleton.jsx";
import { Alert } from "../components/ui/Alert.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { todayUtcDateString } from "../utils/format.js";

function defaultRange() {
  const endDate = todayUtcDateString();
  const start = new Date(`${endDate}T00:00:00.000Z`);
  start.setUTCDate(start.getUTCDate() - 6);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate,
  };
}

export default function Reports() {
  const { logout } = useAuth();
  const initialRange = useMemo(() => defaultRange(), []);

  const [filterDraft, setFilterDraft] = useState(initialRange);
  const [appliedRange, setAppliedRange] = useState(initialRange);

  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState("");
  const [sectionErrors, setSectionErrors] = useState([]);

  const [weekly, setWeekly] = useState(null);
  const [macros, setMacros] = useState(null);
  const [micros, setMicros] = useState(null);

  const loadReports = useCallback(
    async (range = appliedRange) => {
      setLoading(true);
      setFatalError("");
      setSectionErrors([]);

      if (!range.startDate || !range.endDate) {
        setLoading(false);
        setFatalError("Please choose both a start date and an end date.");
        return;
      }

      if (range.startDate > range.endDate) {
        setLoading(false);
        setFatalError("Start date cannot be after end date.");
        return;
      }

      try {
        const [weeklyResult, macrosResult, microsResult] = await Promise.allSettled([
          getWeeklyReport(range),
          getMacrosReport(range),
          getMicrosReport(range),
        ]);

        const nextSectionErrors = [];

        if (weeklyResult.status === "fulfilled") {
          setWeekly(weeklyResult.value.data.report);
        } else {
          setWeekly(null);
          if (
            weeklyResult.reason instanceof ApiError &&
            weeklyResult.reason.status === 401
          ) {
            logout();
            return;
          }
          nextSectionErrors.push("Calorie trend could not be loaded.");
        }

        if (macrosResult.status === "fulfilled") {
          setMacros(macrosResult.value.data.report);
        } else {
          setMacros(null);
          if (
            macrosResult.reason instanceof ApiError &&
            macrosResult.reason.status === 401
          ) {
            logout();
            return;
          }
          nextSectionErrors.push("Macro and goal comparison could not be loaded.");
        }

        if (microsResult.status === "fulfilled") {
          setMicros(microsResult.value.data.report);
        } else {
          setMicros(null);
          if (
            microsResult.reason instanceof ApiError &&
            microsResult.reason.status === 401
          ) {
            logout();
            return;
          }
          nextSectionErrors.push("Micronutrient summary could not be loaded.");
        }

        if (
          weeklyResult.status === "rejected" &&
          macrosResult.status === "rejected" &&
          microsResult.status === "rejected"
        ) {
          const first = weeklyResult.reason;
          setFatalError(
            first instanceof ApiError
              ? first.message
              : "Unable to load reports. Please try again.",
          );
        }

        setSectionErrors(nextSectionErrors);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setFatalError(
          err instanceof ApiError
            ? err.message
            : "Unable to load reports. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [appliedRange, logout],
  );

  useEffect(() => {
    loadReports(appliedRange);
  }, [appliedRange, loadReports]);

  function handleApply() {
    setAppliedRange(filterDraft);
  }

  function handleReset() {
    const next = defaultRange();
    setFilterDraft(next);
    setAppliedRange(next);
  }

  const rangeLabel = `${appliedRange.startDate} → ${appliedRange.endDate}`;
  const goals = macros?.goals ?? weekly?.goals ?? null;
  const calorieGoal = goals?.dailyCalories ?? null;

  if (loading) {
    return <ReportsSkeleton />;
  }

  if (fatalError && !weekly && !macros && !micros) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Alert title="Reports unavailable">{fatalError}</Alert>
        <Button type="button" onClick={() => loadReports()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Reports
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
          Review calories, macros, and micronutrients over a selected period.
        </p>
      </header>

      <ReportFilters
        values={filterDraft}
        onChange={setFilterDraft}
        onApply={handleApply}
        onReset={handleReset}
        disabled={loading}
      />

      {fatalError ? <Alert title="Some data may be incomplete">{fatalError}</Alert> : null}

      {sectionErrors.map((message) => (
        <Alert key={message} tone="info">
          {message}
        </Alert>
      ))}

      {weekly ? (
        <CalorieTrendChart
          days={weekly.days}
          calorieGoal={calorieGoal}
          rangeLabel={rangeLabel}
        />
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {macros ? (
          <MacroReport
            averages={macros.averageDailyActual}
            totals={macros.totals}
            goals={macros.goals}
            comparison={macros.comparison}
          />
        ) : null}
        <GoalVsActual
          averages={macros?.averageDailyActual}
          goals={goals}
          comparison={macros?.comparison}
        />
      </div>

      {micros ? (
        <MicroSummary totals={micros.totals} daily={micros.daily} />
      ) : null}
    </div>
  );
}
