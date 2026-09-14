export function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover disabled:bg-primary/60",
    secondary:
      "bg-surface text-ink border border-line hover:bg-primary-soft disabled:opacity-60",
    ghost: "bg-transparent text-muted hover:bg-primary-soft hover:text-ink",
    danger:
      "bg-danger text-white hover:bg-danger/90 disabled:bg-danger/60",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait…" : children}
    </button>
  );
}
