import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientCard from "../components/PatientCard";
import { patientService } from "../services/patientsService";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    patientService
      .findAll()
      .then((data) => setPatients(data))
      .catch((err) => setErreur("Impossible de charger les patients."))
      .finally(() => setChargement(false));
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

        {chargement && (
          <p className="text-center text-gray-400 py-12">Chargement...</p>
        )}

        {erreur && (
          <p className="text-center text-red-400 py-12">{erreur}</p>
        )}

        {!chargement && !erreur && (
          <div className="space-y-3">
            {patientsFiltres.map((p) => (
              <PatientCard key={p.id} {...p} />
            ))}
            {patientsFiltres.length === 0 && (
              <p className="text-center text-gray-400 py-8">Aucun patient trouvé.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientsPage;
