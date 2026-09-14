export function Alert({ tone = "error", title, children }) {
  const tones = {
    error: "border-danger/20 bg-danger-soft text-danger",
    success: "border-success/20 bg-primary-soft text-success",
    info: "border-line bg-surface text-muted",
  };

  return (
    <div
      role="alert"
      className={`rounded-lg border px-3.5 py-3 text-sm ${tones[tone]}`}
    >
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? <div className={title ? "mt-1" : ""}>{children}</div> : null}
    </div>
  );
}
