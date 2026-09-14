import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiError } from "../api/client.js";
import {
  createMeal,
  deleteMeal,
  getMeals,
  updateMeal,
} from "../api/mealsApi.js";
import {
  FoodScanner,
  suggestionToMealDraft,
} from "../components/ai/FoodScanner.jsx";
import { MealFilters } from "../components/meals/MealFilters.jsx";
import { MealForm } from "../components/meals/MealForm.jsx";
import { MealList } from "../components/meals/MealList.jsx";
import { MealPagination } from "../components/meals/MealPagination.jsx";
import { Alert } from "../components/ui/Alert.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Spinner } from "../components/ui/Spinner.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const PAGE_SIZE = 10;

const emptyFilters = {
  startDate: "",
  endDate: "",
  mealType: "",
};

export default function Meals() {
  const { logout } = useAuth();

  const [filterDraft, setFilterDraft] = useState(emptyFilters);
  const [appliedFilters, setAppliedFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);

  const [meals, setMeals] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [estimateNotice, setEstimateNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const filtersActive = useMemo(
    () =>
      Boolean(
        appliedFilters.startDate ||
          appliedFilters.endDate ||
          appliedFilters.mealType,
      ),
    [appliedFilters],
  );

  const loadMeals = useCallback(
    async (nextPage = page, filters = appliedFilters) => {
      setLoading(true);
      setError("");

      try {
        const response = await getMeals({
          page: nextPage,
          limit: PAGE_SIZE,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          mealType: filters.mealType || undefined,
        });

        setMeals(response.data.meals || []);
        setPagination(
          response.data.pagination || {
            page: nextPage,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }
        setMeals([]);
        setError(
          err instanceof ApiError
            ? err.message
            : "Unable to load meals. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters, logout, page],
  );

  useEffect(() => {
    loadMeals(page, appliedFilters);
  }, [loadMeals, page, appliedFilters]);

  function openCreateForm() {
    setEditingMeal(null);
    setEstimateNotice("");
    setFormError("");
    setSuccessMessage("");
    setFormOpen(true);
  }

  function openEditForm(meal) {
    setEditingMeal(meal);
    setEstimateNotice("");
    setFormError("");
    setSuccessMessage("");
    setFormOpen(true);
  }

  function closeForm() {
    if (submitting) return;
    setFormOpen(false);
    setEditingMeal(null);
    setEstimateNotice("");
    setFormError("");
  }

  function handleApplyFilters() {
    setPage(1);
    setAppliedFilters(filterDraft);
  }

  function handleResetFilters() {
    setFilterDraft(emptyFilters);
    setPage(1);
    setAppliedFilters(emptyFilters);
  }

  function handleAnalyzed(suggestion) {
    const draft = suggestionToMealDraft(suggestion);
    setEditingMeal(draft);
    setEstimateNotice(
      suggestion.isEstimate || suggestion.imageKind === "food_photo"
        ? "AI estimates are based on the detected serving. Review the values before saving."
        : suggestion.notes ||
            "AI extracted these values from your image. Review them before saving.",
    );
    setFormError("");
    setSuccessMessage("");
    setFormOpen(true);
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setFormError("");

    try {
      const isEdit = Boolean(editingMeal?.id);

      if (isEdit) {
        await updateMeal(editingMeal.id, payload);
      } else {
        await createMeal(payload);
      }

      setFormOpen(false);
      setEditingMeal(null);
      setEstimateNotice("");
      setSuccessMessage(
        isEdit ? "Meal updated successfully." : "Meal saved successfully.",
      );

      if (!isEdit && page !== 1) {
        setPage(1);
      } else {
        await loadMeals(isEdit ? page : 1, appliedFilters);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Unable to save this meal. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(meal) {
    const confirmed = window.confirm(
      `Delete “${meal.foodName}”? This cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(meal.id);
    setError("");
    setSuccessMessage("");

    try {
      await deleteMeal(meal.id);

      const isLastItemOnPage = meals.length === 1 && page > 1;
      const nextPage = isLastItemOnPage ? page - 1 : page;

      if (nextPage !== page) {
        setPage(nextPage);
      } else {
        await loadMeals(page, appliedFilters);
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to delete this meal. Please try again.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Meals
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            Browse, filter, and manage your meal entries by date and meal type.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setSuccessMessage("");
              setScannerOpen(true);
            }}
          >
            Scan food
          </Button>
          <Button type="button" onClick={openCreateForm}>
            Add meal
          </Button>
        </div>
      </header>

      {successMessage ? (
        <Alert tone="success" title="Saved">
          {successMessage}
        </Alert>
      ) : null}

      <MealFilters
        values={filterDraft}
        onChange={setFilterDraft}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        disabled={loading || submitting || Boolean(deletingId)}
      />

      {error ? (
        <div className="space-y-3">
          <Alert title="Couldn’t load meals">{error}</Alert>
          <Button type="button" variant="secondary" onClick={() => loadMeals()}>
            Try again
          </Button>
        </div>
      ) : null}

      {loading ? (
        <Spinner label="Loading meals…" />
      ) : !error && meals.length === 0 ? (
        <section className="rounded-xl border border-dashed border-line bg-surface px-5 py-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No meals found
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            {filtersActive
              ? "No meals match your current filters. Try clearing them or choose a different date range."
              : "Your meal log is empty. Add your first meal or scan a food photo to start tracking."}
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {filtersActive ? (
              <Button type="button" variant="secondary" onClick={handleResetFilters}>
                Clear filters
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={() => setScannerOpen(true)}
            >
              Scan food
            </Button>
            <Button type="button" onClick={openCreateForm}>
              Add meal
            </Button>
          </div>
        </section>
      ) : !error ? (
        <>
          <MealList
            meals={meals}
            onEdit={openEditForm}
            onDelete={handleDelete}
            deletingId={deletingId}
            disabled={submitting}
          />
          <MealPagination
            pagination={pagination}
            onPageChange={setPage}
            disabled={loading || submitting || Boolean(deletingId)}
          />
        </>
      ) : null}

      <FoodScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onAnalyzed={handleAnalyzed}
        onAuthError={logout}
      />

      <MealForm
        open={formOpen}
        mode={editingMeal?.id ? "edit" : "create"}
        meal={editingMeal}
        onClose={closeForm}
        onSubmit={handleSubmit}
        submitting={submitting}
        apiError={formError}
        estimateNotice={estimateNotice}
      />
    </div>
  );
}
