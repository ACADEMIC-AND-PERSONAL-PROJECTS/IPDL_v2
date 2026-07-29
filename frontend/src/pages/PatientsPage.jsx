import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import PatientCard from "../components/PatientCard";
import { patientService } from "../services/patientsService";
import { HiOutlineMagnifyingGlass, HiOutlineUserPlus } from "react-icons/hi2";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    patientService
      .findAll()
      .then((data) => setPatients(data))
      .catch(() => setErreur("Impossible de charger les patients."))
      .finally(() => setChargement(false));
  }, []);

  const patientsFiltres = patients.filter(
    (p) =>
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.prenom.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar />
      <div className="ss-page">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="ss-section-title">Patients</h1>
            <p className="ss-section-sub">
              {patients.length} patient{patients.length !== 1 ? "s" : ""} enregistré{patients.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="ss-btn-primary !py-2.5 !px-5 text-sm">
            <HiOutlineUserPlus className="h-4 w-4" />
            Nouveau patient
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom ou prénom…"
            className="ss-input pl-12 text-[15px]"
          />
        </div>

        {/* States */}
        {chargement && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-[3px] border-brand-faint border-t-brand rounded-full animate-spin mb-4" />
            <p className="text-ink-muted text-sm">Chargement des patients…</p>
          </div>
        )}

        {erreur && (
          <div className="text-center py-20">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-soft text-danger mb-4 ring-1 ring-danger-faint">
              <span className="text-2xl">!</span>
            </div>
            <p className="text-danger font-medium">{erreur}</p>
          </div>
        )}

        {!chargement && !erreur && (
          <div className="space-y-2.5 ss-stagger">
            {patientsFiltres.map((p) => (
              <PatientCard key={p.id} {...p} />
            ))}
            {patientsFiltres.length === 0 && (
              <div className="text-center py-16">
                <p className="text-ink-faint">
                  {recherche
                    ? "Aucun patient ne correspond à cette recherche."
                    : "Aucun patient enregistré pour le moment."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientsPage;
