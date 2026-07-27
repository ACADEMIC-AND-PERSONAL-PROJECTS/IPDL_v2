import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllPatients } from "../services/patientsService";
import { getConsultationsByPatient, createConsultation } from "../services/consultationsService";
import { extractErrorMessage, extractFieldErrors } from "../services/apiUtils";

const STATUT_BADGE = {
    EN_ATTENTE: { label: "En attente", bg: "#ffc107", color: "#000" },
    ANALYSEE:  { label: "Analysée",  bg: "#0d6efd", color: "#fff" },
    CLOTUREE:  { label: "Clôturée",  bg: "#198754", color: "#fff" },
};

const ConsultationsPage = () => {

    const { getAuthHeader, user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [consultations, setConsultations] = useState([]);
    const [erreur, setErreur] = useState(null);
    const [chargement, setChargement] = useState(true);
    const [chargementConsultations, setChargementConsultations] = useState(false);

    // Formulaire
    const [form, setForm] = useState({ symptomes: "", notes: "" });
    const [successMessage, setSuccessMessage] = useState(null);
    const [champsErreurs, setChampsErreurs] = useState({});

    // Charger la liste des patients au montage
    const chargerPatients = async () => {
        setChargement(true);
        setErreur(null);
        try {
            const data = await getAllPatients(getAuthHeader);
            setPatients(data);
        } catch (err) {
            setErreur(extractErrorMessage(err));
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            setChargement(true);
            try {
                const data = await getAllPatients(getAuthHeader);
                if (mounted) setPatients(data);
            } catch (err) {
                if (mounted) setErreur(extractErrorMessage(err));
            } finally {
                if (mounted) setChargement(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // Charger les consultations quand un patient est selectionne
    useEffect(() => {
        if (!selectedPatientId) {
            setConsultations([]);
            return;
        }
        let mounted = true;
        (async () => {
            setChargementConsultations(true);
            setErreur(null);
            try {
                const data = await getConsultationsByPatient(selectedPatientId, getAuthHeader);
                if (mounted) setConsultations(data);
            } catch (err) {
                if (mounted) setErreur(extractErrorMessage(err));
            } finally {
                if (mounted) setChargementConsultations(false);
            }
        })();
        return () => { mounted = false; };
    }, [selectedPatientId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (champsErreurs[e.target.name]) {
            setChampsErreurs({ ...champsErreurs, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(null);
        setChampsErreurs({});
        setSuccessMessage(null);

        try {
            const consultation = {
                patientId: parseInt(selectedPatientId),
                symptomes: form.symptomes,
                notes: form.notes || null
            };
            const data = await createConsultation(consultation, getAuthHeader);
            setSuccessMessage(`Consultation créée (ID: ${data.id})`);
            setForm({ symptomes: "", notes: "" });
            // Recharger les consultations
            const updated = await getConsultationsByPatient(selectedPatientId, getAuthHeader);
            setConsultations(updated);
        } catch (err) {
            const champs = extractFieldErrors(err);
            if (champs) {
                setChampsErreurs(champs);
            } else {
                setErreur(extractErrorMessage(err));
            }
        }
    };

    const selectedPatient = patients.find((p) => p.id === parseInt(selectedPatientId));

    // --- RENDU ---
    return (
        <div>
            <h2>Consultations</h2>

            {/* Selection du patient */}
            <div style={{ marginBottom: "16px" }}>
                <label><strong>Patient : </strong></label>
                <select
                    value={selectedPatientId}
                    onChange={(e) => {
                        setSelectedPatientId(e.target.value);
                        setSuccessMessage(null);
                    }}
                    style={{ padding: "4px 8px", minWidth: "280px" }}
                >
                    <option value="">-- Sélectionner un patient --</option>
                    {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.nom} {p.prenom} — {p.numeroDossier}
                        </option>
                    ))}
                </select>
            </div>

            {chargement && <p>Chargement des patients...</p>}

            {erreur && (
                <div style={{ background: "#f8d7da", padding: "12px", margin: "8px 0" }}>
                    {erreur}
                    <br/>
                    <button onClick={chargerPatients} style={{ marginTop: "8px" }}>Réessayer</button>
                </div>
            )}

            {successMessage && (
                <div style={{ background: "#d4edda", padding: "12px", margin: "8px 0" }}>
                    {successMessage}
                </div>
            )}

            {/* Formulaire de creation */}
            {selectedPatientId && selectedPatient && (
                <div style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "24px" }}>
                    <h3>Nouvelle consultation pour {selectedPatient.prenom} {selectedPatient.nom}</h3>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "8px" }}>
                            <label><strong>Symptômes :</strong></label><br/>
                            <textarea
                                name="symptomes"
                                value={form.symptomes}
                                onChange={handleChange}
                                rows={3}
                                style={{ width: "100%", maxWidth: "500px" }}
                                required
                            />
                            {champsErreurs.symptomes && <small style={{ color: "red" }}>{champsErreurs.symptomes}</small>}
                        </div>

                        <div style={{ marginBottom: "8px" }}>
                            <label><strong>Notes :</strong></label><br/>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={handleChange}
                                rows={2}
                                style={{ width: "100%", maxWidth: "500px" }}
                            />
                        </div>

                        <button type="submit">Créer la consultation</button>
                    </form>
                </div>
            )}

            {/* Liste des consultations */}
            {selectedPatientId && (
                <div>
                    <h3>Historique des consultations</h3>

                    {chargementConsultations && <p>Chargement...</p>}

                    {!chargementConsultations && consultations.length === 0 && (
                        <p>Aucune consultation pour ce patient.</p>
                    )}

                    {consultations.map((c) => {
                        const badge = STATUT_BADGE[c.statut] || { label: c.statut, bg: "#6c757d", color: "#fff" };
                        return (
                            <div key={c.id} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span>
                                        <strong>{new Date(c.date).toLocaleDateString("fr-FR", { dateStyle: "long" })}</strong>
                                        {" — "}
                                        <small>{new Date(c.date).toLocaleTimeString("fr-FR", { timeStyle: "short" })}</small>
                                    </span>
                                    <span style={{
                                        background: badge.bg,
                                        color: badge.color,
                                        padding: "2px 10px",
                                        borderRadius: "12px",
                                        fontSize: "0.85em",
                                        fontWeight: "bold"
                                    }}>
                                        {badge.label}
                                    </span>
                                </div>

                                <div style={{ marginBottom: "6px" }}>
                                    <strong>Symptômes :</strong> {c.symptomes}
                                </div>

                                {c.diagnosticIa && (
                                    <div style={{ marginBottom: "6px" }}>
                                        <strong>Diagnostic IA :</strong> {c.diagnosticIa}
                                        {c.scoreConfiance && (
                                            <span style={{ marginLeft: "8px", fontSize: "0.9em", color: "#6c757d" }}>
                                                (confiance : {(c.scoreConfiance * 100).toFixed(0)} %)
                                            </span>
                                        )}
                                    </div>
                                )}

                                {c.notes && (
                                    <div style={{ marginBottom: "6px" }}>
                                        <strong>Notes :</strong> {c.notes}
                                    </div>
                                )}

                                <div style={{ fontSize: "0.85em", color: "#6c757d" }}>
                                    Saisi par : {c.agentNom} ({c.agentEmail})
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ConsultationsPage;
