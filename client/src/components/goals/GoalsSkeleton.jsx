export function GoalsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <div className="h-8 w-36 animate-pulse rounded-lg bg-line/70" />
        <div className="h-4 w-96 max-w-full animate-pulse rounded bg-line/50" />
      </div>
      <div className="h-72 animate-pulse rounded-xl border border-line bg-surface" />
    </div>
  );
}
