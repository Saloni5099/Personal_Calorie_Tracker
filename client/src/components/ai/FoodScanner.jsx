import { useEffect, useMemo, useState } from "react";
import { analyzeFoodImage } from "../../api/aiApi.js";
import { ApiError } from "../../api/client.js";
import { Alert } from "../ui/Alert.jsx";
import { Button } from "../ui/Button.jsx";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function resolveQuantityAndUnit(suggestion) {
  const isLabel = suggestion.imageKind === "nutrition_label";
  const unit =
    typeof suggestion.unit === "string" ? suggestion.unit.trim() : "";
  const hasExplicitServing =
    suggestion.quantity != null && unit.length > 0;

  if (isLabel && hasExplicitServing) {
    return { quantity: suggestion.quantity, unit };
  }

  // Plate/food photos and any scan without an explicit serving size.
  return { quantity: 1, unit: "serving" };
}

export function suggestionToMealDraft(suggestion) {
  const { quantity, unit } = resolveQuantityAndUnit(suggestion);

  return {
    foodName: suggestion.foodName || "",
    mealType: suggestion.mealType || "LUNCH",
    quantity,
    unit,
    calories: suggestion.calories ?? "",
    protein: suggestion.protein ?? "",
    carbs: suggestion.carbs ?? "",
    fat: suggestion.fat ?? "",
    vitaminA: suggestion.vitaminA ?? "",
    vitaminC: suggestion.vitaminC ?? "",
    vitaminD: suggestion.vitaminD ?? "",
    calcium: suggestion.calcium ?? "",
    iron: suggestion.iron ?? "",
    consumedAt: new Date().toISOString(),
  };
}

export function FoodScanner({ open, onClose, onAnalyzed, onAuthError }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [localError, setLocalError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!open) {
      setFile(null);
      setLocalError("");
      setAnalyzing(false);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return {
      name: file.name,
      sizeMb: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type,
    };
  }, [file]);

  if (!open) return null;

  function clearSelection() {
    setFile(null);
    setLocalError("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }

  function handleFileChange(event) {
    const next = event.target.files?.[0];
    event.target.value = "";
    setLocalError("");

    if (!next) return;

    if (!ALLOWED_TYPES.includes(next.type)) {
      setLocalError("Please choose a JPEG, PNG, or WebP image.");
      return;
    }

    if (next.size > MAX_BYTES) {
      setLocalError("Image is too large. Please choose a file under 5 MB.");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  }

  async function handleAnalyze() {
    if (!file) {
      setLocalError("Select an image before analyzing.");
      return;
    }

    setAnalyzing(true);
    setLocalError("");

    try {
      const response = await analyzeFoodImage(file);
      onAnalyzed(response.data.suggestion);
      clearSelection();
      onClose();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        onAuthError?.();
        return;
      }
      setLocalError(
        err instanceof ApiError
          ? err.message
          : "Unable to analyze this image. Please try again.",
      );
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="food-scanner-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close food scanner"
        onClick={() => {
          if (!analyzing) onClose();
        }}
        disabled={analyzing}
      />

      <div className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-surface p-5 shadow-lg sm:rounded-2xl sm:p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2
              id="food-scanner-title"
              className="font-display text-xl font-semibold text-ink"
            >
              Scan food
            </h2>
            <p className="mt-1 text-sm text-muted">
              Upload a nutrition label or food photo. AI suggests values — you
              review and save.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={analyzing}
          >
            Close
          </Button>
        </div>

        <p className="mb-4 text-xs text-muted">
          Supported: JPEG, PNG, WebP · Max size: 5 MB
        </p>

        {localError ? (
          <div className="mb-4">
            <Alert title="Scan unavailable">{localError}</Alert>
          </div>
        ) : null}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="food-image-input"
              className="block text-sm font-medium text-ink"
            >
              Food image
            </label>
            <input
              id="food-image-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={analyzing}
              className="mt-1.5 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary-soft file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
            />
          </div>

          {previewUrl ? (
            <div className="overflow-hidden rounded-xl border border-line bg-canvas">
              <img
                src={previewUrl}
                alt="Selected food preview"
                className="max-h-64 w-full object-contain"
              />
              {fileMeta ? (
                <p className="border-t border-line px-3 py-2 text-xs text-muted">
                  {fileMeta.name} · {fileMeta.sizeMb} MB
                </p>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-canvas/60 px-4 py-8 text-center text-sm text-muted">
              Choose an image to preview it here. Nothing is uploaded until you
              click Analyze image.
            </div>
          )}

          {analyzing ? (
            <p className="text-sm text-muted" role="status">
              Analyzing image… this may take a few seconds.
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            {file ? (
              <Button
                type="button"
                variant="secondary"
                onClick={clearSelection}
                disabled={analyzing}
              >
                Replace / clear
              </Button>
            ) : null}
            <Button
              type="button"
              onClick={handleAnalyze}
              loading={analyzing}
              disabled={!file}
            >
              Analyze image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
