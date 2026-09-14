import { Link } from "react-router-dom";

export function QuickActions() {
  return (
    <section className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="font-display text-lg font-semibold text-ink">
        Quick actions
      </h2>
      <p className="mt-1 text-sm text-muted">
        Jump to the pages that are ready now.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
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
    </section>
  );
}
