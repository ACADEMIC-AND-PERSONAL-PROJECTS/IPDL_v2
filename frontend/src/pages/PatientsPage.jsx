import { useState, useEffect, useCallback } from "react";
import NavBar from "../components/NavBar";
import PatientCard from "../components/PatientCard";
import { patientService } from "../services/patientsService";
import { extractErrorMessage } from "../services/apiUtils";
import api from "../services/api";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUserPlus,
  HiOutlineXMark,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const FORM_VIDE = {
  nom: "",
  prenom: "",
  dateNaissance: "",
  sexe: "MASCULIN",
  telephone: "",
  addresse: "",
  region: "",
  etablissementId: "",
};

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  // ── Modal création patient ──
  const [modalOuverte, setModalOuverte] = useState(false);
  const [form, setForm] = useState(FORM_VIDE);
  const [etablissements, setEtablissements] = useState([]);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreurFormulaire, setErreurFormulaire] = useState("");

  const chargerPatients = useCallback(() => {
    setChargement(true);
    patientService
      .findAll()
      .then((data) => setPatients(data))
      .catch(() => setErreur("Impossible de charger les patients."))
      .finally(() => setChargement(false));
  }, []);

  useEffect(() => {
    chargerPatients();
  }, [chargerPatients]);

  const ouvrirModal = () => {
    setForm(FORM_VIDE);
    setErreurFormulaire("");
    setModalOuverte(true);
    // Charger les établissements pour le select
    api
      .get("/api/etablissements")
      .then((r) => setEtablissements(Array.isArray(r.data) ? r.data : []))
      .catch(() => setEtablissements([]));
  };

  const fermerModal = () => {
    setModalOuverte(false);
    setEnvoiEnCours(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreurFormulaire("");
    setEnvoiEnCours(true);
    try {
      await patientService.create({
        nom: form.nom,
        prenom: form.prenom,
        dateNaissance: form.dateNaissance || null,
        sexe: form.sexe,
        telephone: form.telephone || null,
        addresse: form.addresse || null,
        region: form.region,
        etablissementId: Number(form.etablissementId),
      });
      fermerModal();
      chargerPatients();
    } catch (err) {
      setErreurFormulaire(extractErrorMessage(err));
    } finally {
      setEnvoiEnCours(false);
    }
  };

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
          <button
            className="ss-btn-primary !py-2.5 !px-5 text-sm"
            onClick={ouvrirModal}
          >
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

      {/* ── Modal : création patient ── */}
      {modalOuverte && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) fermerModal();
          }}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl animate-scale-in overflow-hidden">
            {/* En-tête */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-ice">
              <h2 className="text-lg font-display font-bold text-ink">
                Nouveau patient
              </h2>
              <button
                type="button"
                onClick={fermerModal}
                className="p-1.5 rounded-lg text-ink-faint hover:text-ink hover:bg-canvas transition-colors"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="ss-label" htmlFor="modal-nom">
                    Nom <span className="text-danger">*</span>
                  </label>
                  <input
                    id="modal-nom"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    className="ss-input"
                    placeholder="Diop"
                  />
                </div>
                <div>
                  <label className="ss-label" htmlFor="modal-prenom">
                    Prénom <span className="text-danger">*</span>
                  </label>
                  <input
                    id="modal-prenom"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    className="ss-input"
                    placeholder="Mamadou"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="ss-label" htmlFor="modal-dateNaissance">
                    Date de naissance
                  </label>
                  <input
                    id="modal-dateNaissance"
                    type="date"
                    name="dateNaissance"
                    value={form.dateNaissance}
                    onChange={handleChange}
                    className="ss-input"
                  />
                </div>
                <div>
                  <label className="ss-label" htmlFor="modal-sexe">
                    Sexe
                  </label>
                  <select
                    id="modal-sexe"
                    name="sexe"
                    value={form.sexe}
                    onChange={handleChange}
                    className="ss-select"
                  >
                    <option value="MASCULIN">Masculin</option>
                    <option value="FEMININ">Féminin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="ss-label" htmlFor="modal-telephone">
                  Téléphone
                </label>
                <input
                  id="modal-telephone"
                  type="tel"
                  name="telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="ss-input"
                  placeholder="770000000"
                  pattern="[0-9]{9}"
                  title="9 chiffres sans espaces"
                />
              </div>

              <div>
                <label className="ss-label" htmlFor="modal-addresse">
                  Adresse
                </label>
                <input
                  id="modal-addresse"
                  name="addresse"
                  value={form.addresse}
                  onChange={handleChange}
                  className="ss-input"
                  placeholder="Rue, quartier…"
                />
              </div>

              <div>
                <label className="ss-label" htmlFor="modal-region">
                  Région <span className="text-danger">*</span>
                </label>
                <input
                  id="modal-region"
                  name="region"
                  value={form.region}
                  onChange={handleChange}
                  required
                  className="ss-input"
                  placeholder="Dakar, Thiès…"
                />
              </div>

              <div>
                <label className="ss-label" htmlFor="modal-etablissementId">
                  Établissement <span className="text-danger">*</span>
                </label>
                <select
                  id="modal-etablissementId"
                  name="etablissementId"
                  value={form.etablissementId}
                  onChange={handleChange}
                  required
                  className="ss-select"
                >
                  <option value="">Sélectionner…</option>
                  {etablissements.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nom} ({e.region})
                    </option>
                  ))}
                </select>
              </div>

              {erreurFormulaire && (
                <div className="flex items-start gap-3 rounded-xl bg-danger-soft border border-danger-faint p-4 text-sm text-danger animate-fade-in">
                  <HiOutlineExclamationTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>{erreurFormulaire}</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={fermerModal}
                  className="ss-btn-secondary flex-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={envoiEnCours}
                  className="ss-btn-primary flex-1"
                >
                  {envoiEnCours ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Création…
                    </span>
                  ) : (
                    "Créer le patient"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientsPage;
