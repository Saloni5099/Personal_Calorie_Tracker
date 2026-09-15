import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ApiError } from "../../api/client.js";
import { getStreak } from "../../api/streakApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

function LeafLogo({ className = "h-9 w-9" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" className="fill-primary-soft" />
      <path
        d="M28.5 11.5c-8.5 1-15 7.2-16.8 15.8 5.8.6 12.2-2.4 16.2-7.8 2.4-3.2 2.2-6.2.6-8z"
        className="fill-primary"
      />
      <path
        d="M28.2 11.8c-2.2 5.8-7 10.4-13.8 12.8"
        stroke="#185546"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function StreakBadge() {
  const [status, setStatus] = useState("loading");
  const [currentStreak, setCurrentStreak] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStreak() {
      setStatus("loading");
      try {
        const response = await getStreak();
        const value =
          response?.data?.currentStreak ??
          response?.data?.streak?.currentStreak ??
          response?.currentStreak;

        if (cancelled) return;

        if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
          setCurrentStreak(value);
          setStatus("ready");
          return;
        }

        if (import.meta.env.DEV) {
          console.error("Streak response missing currentStreak", {
            endpoint: "/reports/streak",
            data: response?.data,
          });
        }
        setStatus("error");
      } catch (error) {
        if (!cancelled) {
          if (import.meta.env.DEV) {
            console.error("Streak request failed", {
              endpoint: "/reports/streak",
              status: error instanceof ApiError ? error.status : undefined,
              message: error instanceof Error ? error.message : String(error),
            });
          }
          setStatus("error");
        }
      }
    }

    loadStreak();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        className="h-8 w-24 animate-pulse rounded-full bg-line/70 sm:w-32"
        aria-hidden="true"
      />
    );
  }

  if (status === "error" || currentStreak == null) {
    return (
      <div
        className="inline-flex max-w-[9rem] items-center rounded-full border border-line bg-canvas px-2.5 py-1 text-xs font-medium text-muted sm:max-w-none"
        title="Streak unavailable"
      >
        <span className="truncate">Streak unavailable</span>
      </div>
    );
  }

  const streakLabel =
    currentStreak === 1 ? "1 Day Streak" : `${currentStreak} Day Streak`;

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900 sm:px-3 sm:text-sm"
      aria-label={streakLabel}
      title={streakLabel}
    >
      <span aria-hidden="true">🔥</span>
      <span className="whitespace-nowrap">
        <span className="sm:hidden">{currentStreak}d</span>
        <span className="hidden sm:inline">{streakLabel}</span>
      </span>
    </div>
  );
}

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuId = useId();
  const initials = useMemo(() => getInitials(user?.name), [user?.name]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface/95 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
            aria-label="Open navigation menu"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              ☰
            </span>
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <LeafLogo className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            <div className="min-w-0 leading-tight">
              <p className="font-display truncate text-base font-bold tracking-tight text-ink sm:text-lg">
                Nourish
              </p>
              <p className="truncate text-xs text-muted sm:text-sm">
                Personal Calorie Tracker
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <StreakBadge />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2 transition-colors hover:bg-canvas sm:pr-2.5"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white"
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="hidden max-w-[8rem] truncate text-sm font-medium text-ink sm:inline">
                {user?.name || "Account"}
              </span>
              <span className="text-xs text-muted" aria-hidden="true">
                ▼
              </span>
              <span className="sr-only">Open account menu</span>
            </button>

            {menuOpen ? (
              <div
                id={menuId}
                role="menu"
                className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lg"
              >
                <Link
                  role="menuitem"
                  to="/profile"
                  className="block px-3 py-2 text-sm text-ink hover:bg-canvas"
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-canvas"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                >
                  Log out
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
