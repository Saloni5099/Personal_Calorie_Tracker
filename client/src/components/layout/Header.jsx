import { Button } from "../ui/Button.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-surface/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
          aria-label="Open navigation menu"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ☰
          </span>
        </button>
        <div>
          <p className="text-sm text-muted">Signed in as</p>
          <p className="font-medium text-ink">{user?.name}</p>
        </div>
      </div>

      <Button variant="secondary" onClick={logout}>
        Log out
      </Button>
    </header>
  );
}
