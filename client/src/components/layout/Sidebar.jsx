import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/meals", label: "Meals" },
  { to: "/reports", label: "Reports" },
  { to: "/goals", label: "Goals" },
];

export function Sidebar({ onNavigate }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-line bg-surface">
      <div className="border-b border-line px-5 py-5">
        <p className="font-display text-lg font-semibold tracking-tight text-ink">
          Nourish
        </p>
        <p className="mt-1 text-sm text-muted">Personal Calorie Tracker</p>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Main">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-canvas hover:text-ink"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <NavLink
          to="/profile"
          onClick={onNavigate}
          className={({ isActive }) =>
            `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary-soft text-primary"
                : "text-muted hover:bg-canvas hover:text-ink"
            }`
          }
        >
          Profile
        </NavLink>
      </div>
    </aside>
  );
}
