import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../api/client.js";
import { getGoals } from "../api/goalsApi.js";
import { getMeals } from "../api/mealsApi.js";
import { getDailyReport, getWeeklyReport } from "../api/reportsApi.js";
import { CalorieSummary } from "../components/dashboard/CalorieSummary.jsx";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton.jsx";
import { GoalProgress } from "../components/dashboard/GoalProgress.jsx";
import { MacroSummary } from "../components/dashboard/MacroSummary.jsx";
import { MealSummary } from "../components/dashboard/MealSummary.jsx";
import { WeeklyCaloriesChart } from "../components/dashboard/WeeklyCaloriesChart.jsx";
import { Alert } from "../components/ui/Alert.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDisplayDate, todayUtcDateString } from "../utils/format.js";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sectionError, setSectionError] = useState("");
  const [daily, setDaily] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [meals, setMeals] = useState([]);
  const [goalsMissing, setGoalsMissing] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setSectionError("");

    const today = todayUtcDateString();

    try {
      const [dailyResult, weeklyResult, mealsResult, goalsResult] =
        await Promise.allSettled([
          getDailyReport({ date: today }),
          getWeeklyReport(),
          getMeals({
            startDate: today,
            endDate: today,
            page: 1,
            limit: 100,
          }),
          getGoals(),
        ]);

      if (dailyResult.status === "rejected") {
        const err = dailyResult.reason;
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        throw err instanceof Error
          ? err
          : new Error("Unable to load today's report.");
      }

      setDaily(dailyResult.value.data.report);

      if (weeklyResult.status === "fulfilled") {
        setWeekly(weeklyResult.value.data.report);
      } else {
        setWeekly(null);
        setSectionError(
          "Weekly trend could not be loaded. Other sections below may still be available.",
        );
      }

      if (mealsResult.status === "fulfilled") {
        setMeals(mealsResult.value.data.meals || []);
      } else {
        setMeals([]);
        setSectionError((prev) =>
          prev
            ? prev
            : "Today's meal list could not be loaded. Totals still come from reports.",
        );
      }

      if (goalsResult.status === "fulfilled") {
        setGoalsMissing(false);
      } else if (
        goalsResult.reason instanceof ApiError &&
        goalsResult.reason.status === 404
      ) {
        setGoalsMissing(true);
      } else {
        setGoalsMissing(dailyResult.value.data.report.goals == null);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to load your dashboard. Please try again.",
      );
      setDaily(null);
      setWeekly(null);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Alert title="Dashboard unavailable">{error}</Alert>
        <Button onClick={loadDashboard}>Try again</Button>
      </div>
    );
  }

  const totals = daily?.totals;
  const goals = daily?.goals;
  const comparison = daily?.comparison;
  const today = daily?.date || todayUtcDateString();
  const hasMeals = meals.length > 0;
  const isNewUser = !hasMeals && goalsMissing;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <div className="grid items-center gap-6 p-5 sm:p-6 lg:grid-cols-5 lg:gap-8">
          <div className="space-y-4 lg:col-span-3">
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {isNewUser
                  ? `Welcome, ${user?.name?.split(" ")[0] || "there"}.`
                  : `Hello, ${user?.name?.split(" ")[0] || "there"}.`}
              </h1>
              <p className="text-sm text-muted sm:text-base">
                {formatDisplayDate(today)} · Here&apos;s your nutrition overview
                for today.
              </p>
              <p className="max-w-xl text-sm text-muted">
                {isNewUser
                  ? "Set your nutrition goals and log your first meal to start tracking your progress."
                  : "Track your nutrition and stay consistent with your goals."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/meals"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
              >
                Add meal
              </Link>
              <Link
                to="/reports"
                className="inline-flex items-center justify-center rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-primary-soft"
              >
                View reports
              </Link>
              <Link
                to="/goals"
                className="inline-flex items-center justify-center rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-semibold text-ink hover:bg-primary-soft"
              >
                Edit goals
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <img
              src="/dashboard-hero-food.png"
              alt="Healthy balanced meal"
              width="640"
              height="480"
              className="h-44 w-full rounded-xl object-cover sm:h-52 lg:h-56"
              decoding="async"
            />
          </div>
        </div>
      </section>

      {goalsMissing ? (
        <Alert tone="info" title="Goals not set yet">
          <span className="inline">
            Add calorie and macro targets to unlock remaining and goal
            comparisons.{" "}
            <Link
              to="/goals"
              className="font-semibold text-primary hover:text-primary-hover"
            >
              Set goals
            </Link>
          </span>
        </Alert>
      ) : null}

      {sectionError ? <Alert tone="info">{sectionError}</Alert> : null}

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <CalorieSummary
            totals={totals}
            goals={goals}
            comparison={comparison}
          />
        </div>
        <div className="lg:col-span-3">
          <MacroSummary totals={totals} goals={goals} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MealSummary meals={meals} byMealType={daily?.byMealType} />
        <GoalProgress totals={totals} goals={goals} />
      </div>

      {weekly ? (
        <WeeklyCaloriesChart
          days={weekly.days}
          calorieGoal={goals?.dailyCalories ?? weekly.goals?.dailyCalories}
        />
      ) : null}
    </div>
  );
}
