function NavBar({ user, onNavigate, onLogout }) {
  return (
    <nav className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">SénSanté Pro</h1>
      <div className="flex gap-4 items-center">
        <button onClick={() => onNavigate("dashboard")} className="hover:underline">
          Tableau de bord
        </button>
        <button onClick={() => onNavigate("patients")} className="hover:underline">
          Patients
        </button>
        <button onClick={() => onNavigate("consultations")} className="hover:underline">
          Consultations
        </button>
        {user && (
          <span className="text-sm text-blue-200">
            {user.email} ({user.role})
          </span>
        )}
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
