export function ReportsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-line/70" />
        <div className="h-4 w-80 max-w-full animate-pulse rounded bg-line/50" />
      </div>
      <div className="h-28 animate-pulse rounded-xl border border-line bg-surface" />
      <div className="h-72 animate-pulse rounded-xl border border-line bg-surface" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-line bg-surface" />
        <div className="h-64 animate-pulse rounded-xl border border-line bg-surface" />
      </div>
      <div className="h-56 animate-pulse rounded-xl border border-line bg-surface" />
    </div>
  );
}
