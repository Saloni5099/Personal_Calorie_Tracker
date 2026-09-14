import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../api/client.js";
import { createGoals, getGoals, updateGoals } from "../api/goalsApi.js";
import { GoalForm } from "../components/goals/GoalForm.jsx";
import { GoalSummary } from "../components/goals/GoalSummary.jsx";
import { GoalsSkeleton } from "../components/goals/GoalsSkeleton.jsx";
import { Alert } from "../components/ui/Alert.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Goals() {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [goal, setGoal] = useState(null);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await getGoals();
      setGoal(response.data.goal);
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }

      if (err instanceof ApiError && err.status === 404) {
        setGoal(null);
        setEditing(true);
      } else {
        setGoal(null);
        setLoadError(
          err instanceof ApiError
            ? err.message
            : "Unable to load your goals. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  async function handleSubmit(payload) {
    setSubmitting(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = goal
        ? await updateGoals(payload)
        : await createGoals(payload);

      setGoal(response.data.goal);
      setEditing(false);
      setSuccessMessage(
        goal ? "Goals updated successfully." : "Goals saved successfully.",
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }

      if (err instanceof ApiError && err.errors?.length) {
        setFormError(err.message);
      } else {
        setFormError(
          err instanceof ApiError
            ? err.message
            : "Unable to save your goals. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <GoalsSkeleton />;
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Alert title="Goals unavailable">{loadError}</Alert>
        <Button type="button" onClick={loadGoals}>
          Try again
        </Button>
      </div>
    );
  }

  const showForm = !goal || editing;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Goals
        </h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          Set your daily nutrition targets so Nourish can compare your intake
          against your goals.
        </p>
      </header>

      {successMessage ? (
        <Alert tone="success" title="Saved">
          {successMessage}
        </Alert>
      ) : null}

      {!goal ? (
        <section className="rounded-xl border border-dashed border-line bg-surface px-5 py-6">
          <p className="font-medium text-ink">No goals configured yet</p>
          <p className="mt-1 text-sm text-muted">
            Add calorie and macro targets to unlock remaining calories and goal
            comparisons on Dashboard and Reports.
          </p>
        </section>
      ) : null}

      {goal && !editing ? (
        <GoalSummary
          goal={goal}
          onEdit={() => {
            setSuccessMessage("");
            setFormError("");
            setEditing(true);
          }}
        />
      ) : null}

      {showForm ? (
        <GoalForm
          mode={goal ? "edit" : "create"}
          goal={goal}
          onSubmit={handleSubmit}
          onCancel={
            goal
              ? () => {
                  setEditing(false);
                  setFormError("");
                }
              : undefined
          }
          submitting={submitting}
          apiError={formError}
        />
      ) : null}
    </div>
  );
}
