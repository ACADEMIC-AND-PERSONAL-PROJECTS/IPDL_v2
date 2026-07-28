import NavBar from "../components/NavBar";

function DashboardPage() {
  // Données statiques — seront remplacées par l'API en Sprint 3
  const stats = [
    { label: "Patients", valeur: 3, couleur: "bg-blue-100 text-blue-700" },
    { label: "Consultations", valeur: 5, couleur: "bg-green-100 text-green-700" },
    { label: "Analyses IA", valeur: 4, couleur: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-xl p-6 text-center ${s.couleur}`}>
              <p className="text-3xl font-bold">{s.valeur}</p>
              <p className="text-sm font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          <p>Graphiques disponibles au Sprint 3</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
