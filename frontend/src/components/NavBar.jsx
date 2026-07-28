import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const location = useLocation();

  const liens = [
    { path: "/patients", label: "Patients" },
    { path: "/consultations", label: "Consultations" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-blue-800 text-white px-6 py-3 flex items-center justify-between shadow">
      <span className="font-bold text-lg tracking-wide">SénSanté Pro</span>
      <div className="flex gap-6">
        {liens.map((lien) => (
          <Link
            key={lien.path}
            to={lien.path}
            className={`text-sm font-medium hover:text-blue-200 transition-colors
              ${location.pathname === lien.path
                ? "text-white underline underline-offset-4"
                : "text-blue-200"
              }`}
          >
            {lien.label}
          </Link>
        ))}
        <button
          onClick={() => {/* déconnexion Lab React 2 */}}
          className="text-sm text-red-300 hover:text-red-100"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
