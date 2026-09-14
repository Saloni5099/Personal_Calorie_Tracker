export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="grid gap-6 rounded-xl border border-line bg-surface p-5 sm:p-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-line/70" />
          <div className="h-4 w-72 animate-pulse rounded bg-line/50" />
          <div className="h-4 w-64 animate-pulse rounded bg-line/40" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-24 animate-pulse rounded-lg bg-line/60" />
            <div className="h-10 w-28 animate-pulse rounded-lg bg-line/50" />
          </div>
        </div>
        <div className="h-44 animate-pulse rounded-xl bg-line/50 sm:h-52 lg:col-span-2 lg:h-56" />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="h-40 animate-pulse rounded-xl border border-line bg-surface lg:col-span-2" />
        <div className="h-40 animate-pulse rounded-xl border border-line bg-surface" />
        <div className="h-40 animate-pulse rounded-xl border border-line bg-surface" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-xl border border-line bg-surface" />
        <div className="h-72 animate-pulse rounded-xl border border-line bg-surface" />
      </div>

      <div className="h-64 animate-pulse rounded-xl border border-line bg-surface" />
    </div>
  );
}
