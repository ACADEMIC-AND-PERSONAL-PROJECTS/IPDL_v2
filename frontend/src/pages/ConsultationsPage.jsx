import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import DiagnosticIA from "../components/DiagnosticIA";
import Badge from "../components/Badge";
import { consultationService } from "../services/consultationsService";
import { patientService } from "../services/patientsService";
import {
  HiOutlineUser,
  HiOutlineClipboardDocumentList,
  HiOutlinePencilSquare,
  HiOutlineSparkles,
} from "react-icons/hi2";

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
      consultationService.findMines().then(setConsultations);
    } catch (err) {
      alert("Erreur lors de la création de la consultation.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar />
      <div className="ss-page">
        <div className="mb-8">
          <h1 className="ss-section-title">Consultations</h1>
          <p className="ss-section-sub">
            Créez une nouvelle consultation ou consultez l'historique
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* ── Formulaire ── */}
          <div className="lg:col-span-3">
            <div className="ss-chart-card">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <HiOutlinePencilSquare className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink">Nouvelle consultation</h2>
                  <p className="text-xs text-ink-muted">
                    Saisissez les informations du patient et les symptômes
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="ss-label" htmlFor="patient">
                    Patient
                  </label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5 pointer-events-none" />
                    <select
                      id="patient"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      required
                      className="ss-select pl-12"
                    >
                      <option value="">Sélectionner un patient…</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.prenom} {p.nom} — {p.numeroDossier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="ss-label" htmlFor="symptomes">
                    Symptômes décrits
                  </label>
                  <div className="relative">
                    <HiOutlineClipboardDocumentList className="absolute left-4 top-4 text-ink-faint h-5 w-5" />
                    <textarea
                      id="symptomes"
                      value={symptomes}
                      onChange={(e) => setSymptomes(e.target.value)}
                      required
                      rows={4}
                      placeholder="Décrivez les symptômes du patient de manière détaillée…"
                      className="ss-input pl-12 resize-none"
                      style={{ minHeight: "120px" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="ss-label" htmlFor="notes">
                    Notes complémentaires
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Observations, antécédents, contexte…"
                    className="ss-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={envoi}
                  className="ss-btn-primary w-full group"
                >
                  {envoi ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyse IA en cours…
                    </span>
                  ) : (
                    <>
                      <HiOutlineSparkles className="h-5 w-5" />
                      Lancer l'analyse
                    </>
                  )}
                </button>
              </form>

              {/* Résultat IA */}
              {resultat && (
                <DiagnosticIA
                  diagnostic={resultat.diagnosticIa}
                  scoreConfiance={resultat.scoreConfiance}
                  disclaimer={
                    "Ceci n'est pas un diagnostic médical. Consultez un professionnel de santé qualifié."
                  }
                />
              )}
            </div>
          </div>

          {/* ── Historique ── */}
          <div className="lg:col-span-2">
            <div className="ss-chart-card">
              <div className="flex items-center gap-3 mb-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-leaf-soft text-leaf">
                  <HiOutlineClipboardDocumentList className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-ink">Mes consultations</h2>
                  <p className="text-xs text-ink-muted">
                    {consultations.length} consultation{consultations.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {consultations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-ink-faint">
                    Aucune consultation pour l'instant.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-line bg-surface p-4 transition-all duration-200 hover:border-brand-faint hover:shadow-soft"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink truncate">
                            {c.patientPrenom} {c.patientNom}
                          </p>
                          <p className="text-xs text-ink-faint mt-0.5">
                            {new Date(c.date).toLocaleDateString("fr-SN")} —{" "}
                            <span className="font-mono">{c.numeroDossier}</span>
                          </p>
                        </div>
                        <Badge statut={c.statut} />
                      </div>
                      <p className="text-[13px] text-ink-muted leading-relaxed line-clamp-2">
                        {c.symptomes}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultationsPage;
