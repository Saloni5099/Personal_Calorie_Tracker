import { Button } from "../components/ui/Button.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Profile
      </h1>
      <p className="mt-2 text-sm text-muted sm:text-base">
        Basic account information for the signed-in user.
      </p>

      <div className="mt-8 space-y-4 rounded-xl border border-line bg-surface p-5 sm:p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Name
          </p>
          <p className="mt-1 text-ink">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Email
          </p>
          <p className="mt-1 text-ink">{user?.email}</p>
        </div>
        <div className="pt-2">
          <Button variant="secondary" onClick={logout}>
            Log out
          </Button>
        </div>
      </div>
    </section>
  );
}
