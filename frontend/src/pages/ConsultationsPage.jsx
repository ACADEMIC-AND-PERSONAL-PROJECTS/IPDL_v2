import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import DiagnosticIA from "../components/DiagnosticIA";
import { consultationService } from "../services/consultationsService";
import { patientService } from "../services/patientsService";

function ConsultationsPage() {
  const [patients, setPatients] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [symptomes, setSymptomes] = useState("");
  const [notes, setNotes] = useState("");
  const [resultat, setResultat] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    patientService.findAll().then(setPatients);
    consultationService.findMines().then(setConsultations);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true);
    setResultat(null);
    try {
      const consultation = await consultationService.create({
        patientId: Number(patientId),
        symptomes,
        notes,
      });
      setResultat(consultation);
      setSymptomes("");
      setNotes("");
      // Recharger mes consultations
      consultationService.findMines().then(setConsultations);
    } catch (err) {
      alert("Erreur lors de la création de la consultation.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Nouvelle consultation
        </h1>

        {/* Formulaire de création */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Patient
              </label>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Sélectionner un patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.prenom} {p.nom} — {p.numeroDossier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Symptômes décrits
              </label>
              <textarea
                value={symptomes}
                onChange={(e) => setSymptomes(e.target.value)}
                required
                rows={4}
                placeholder="Décrivez les symptômes du patient..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Observations complémentaires..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={envoi}
              className="w-full bg-blue-700 text-white rounded-lg py-2 font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {envoi ? "Analyse IA en cours..." : "Créer et analyser"}
            </button>
          </form>

          {/* Résultat IA */}
          {resultat && (
            <DiagnosticIA
              diagnostic={resultat.diagnosticIa}
              scoreConfiance={resultat.scoreConfiance}
              disclaimer={
                "Ceci n'est pas un diagnostic médical. " +
                "Consultez un professionnel de santé qualifié."
              }
            />
          )}
        </div>

        {/* Mes dernières consultations */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Mes consultations
        </h2>
        <div className="space-y-3">
          {consultations.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {c.patientPrenom} {c.patientNom}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(c.date).toLocaleDateString("fr-SN")} — {c.numeroDossier}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {c.symptomes}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium
                    ${c.statut === "ANALYSEE"
                      ? "bg-green-100 text-green-700"
                      : c.statut === "EN_ATTENTE"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                >
                  {c.statut}
                </span>
              </div>
            </div>
          ))}
          {consultations.length === 0 && (
            <p className="text-center text-gray-400 py-6">
              Aucune consultation pour l'instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultationsPage;
