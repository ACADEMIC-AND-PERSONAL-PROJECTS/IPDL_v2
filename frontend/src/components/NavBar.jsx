import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineChartPie,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";

const liens = [
  { path: "/dashboard", label: "Dashboard", icon: HiOutlineChartPie },
  { path: "/patients", label: "Patients", icon: HiOutlineUserGroup },
  { path: "/consultations", label: "Consultations", icon: HiOutlineClipboardDocumentCheck },
];

function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl saturate-150 border-b border-line/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        {/* Brand + Nav links */}
        <div className="flex items-center gap-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-ink hover:text-brand transition-colors"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white text-xs font-bold shadow-sm">
              S
            </span>
            <span className="hidden sm:inline">
              SénSanté <span className="text-brand">Pro</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {liens.map((lien) => {
              const isActive = location.pathname === lien.path;
              const Icon = lien.icon;
              return (
                <Link
                  key={lien.path}
                  to={lien.path}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand-soft text-brand shadow-sm"
                      : "text-ink-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{lien.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 rounded-lg bg-surface px-3 py-1.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-brand text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || "?"}
            </span>
            <div className="text-xs leading-tight">
              <p className="font-medium text-ink">{user?.email || "—"}</p>
              <p className="text-ink-faint">{user?.role || "—"}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-ink-muted hover:text-danger hover:bg-danger-soft transition-all duration-200"
            title="Se déconnecter"
          >
            <HiOutlineArrowRightOnRectangle className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
