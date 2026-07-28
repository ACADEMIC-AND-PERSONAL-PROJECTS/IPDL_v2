import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavBar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const liens = [
    { path: "/patients", label: "Patients" },
    { path: "/consultations", label: "Consultations" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-blue-800 text-white px-6 py-3 flex items-center justify-between shadow">
      <span className="font-bold text-lg">SénSanté Pro</span>
      <div className="flex items-center gap-6">
        {liens.map((lien) => (
          <Link
            key={lien.path}
            to={lien.path}
            className={`text-sm font-medium hover:text-blue-200
              ${location.pathname === lien.path
                ? "text-white underline underline-offset-4"
                : "text-blue-200"
              }`}
          >
            {lien.label}
          </Link>
        ))}
        <div className="flex items-center gap-3 border-l border-blue-600 pl-4">
          <span className="text-xs text-blue-300">
            {user?.email} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="text-xs text-red-300 hover:text-red-100 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
