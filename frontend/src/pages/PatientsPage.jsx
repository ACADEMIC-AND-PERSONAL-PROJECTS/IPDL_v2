import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientCard from "../components/PatientCard";

// Données statiques pour ce lab (remplacées par l'API en Lab React 2)
const PATIENTS_TEST = [
  { id: 1, nom: "Diallo", prenom: "Fatou", region: "Dakar", numeroDossier: "SP-A1B2C3D4" },
  { id: 2, nom: "Ndiaye", prenom: "Ousmane", region: "Thiès", numeroDossier: "SP-E5F6G7H8" },
  { id: 3, nom: "Sow", prenom: "Aminata", region: "Saint-Louis", numeroDossier: "SP-I9J0K1L2" },
];

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    // Simulation du chargement (Lab React 2 : appel Axios réel)
    const timer = setTimeout(() => {
      setPatients(PATIENTS_TEST);
      setChargement(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const patientsFiltres = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.prenom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">
            Patients ({patients.length})
          </h1>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800">
            + Nouveau patient
          </button>
        </div>

        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher par nom ou prénom..."
          className="w-full border rounded-lg px-4 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {chargement ? (
          <p className="text-center text-gray-400 py-12">Chargement des patients...</p>
        ) : patientsFiltres.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun patient trouvé.</p>
        ) : (
          <div className="space-y-3">
            {patientsFiltres.map((p) => (
              <PatientCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientsPage;
