import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createPatient } from "../services/patientsService";
import { extractErrorMessage, extractFieldErrors } from "../services/apiUtils";
import axios from "axios";

const ETABLISSEMENTS_API = "http://localhost:8080/api/etablissements";

const PatientForm = () => {

    const { getAuthHeader } = useAuth();
    const [etablissements, setEtablissements] = useState([]);
    const [numeroDossierCree, setNumeroDossierCree] = useState(null);
    const [erreur, setErreur] = useState(null);
    const [champsErreurs, setChampsErreurs] = useState({});

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        dateNaissance: "",
        sexe: "MASCULIN",
        telephone: "",
        addresse: "",
        region: "",
        etablissementId: ""
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get(ETABLISSEMENTS_API, { headers: getAuthHeader() });
                setEtablissements(res.data);
            } catch (err) {
                setErreur(extractErrorMessage(err));
            }
        })();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Effacer l'erreur du champ quand l'utilisateur modifie
        if (champsErreurs[e.target.name]) {
            setChampsErreurs({ ...champsErreurs, [e.target.name]: null });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErreur(null);
        setChampsErreurs({});
        setNumeroDossierCree(null);

        try {
            const data = await createPatient(form, getAuthHeader);
            setNumeroDossierCree(data.numeroDossier);
            setForm({
                nom: "", prenom: "", dateNaissance: "", sexe: "MASCULIN",
                telephone: "", addresse: "", region: "", etablissementId: ""
            });
        } catch (err) {
            const champs = extractFieldErrors(err);
            if (champs) {
                setChampsErreurs(champs);
            } else {
                setErreur(extractErrorMessage(err));
            }
        }
    };

    return (
        <div>
            <h2>Nouveau patient</h2>

            {numeroDossierCree && (
                <div style={{ background: "#d4edda", padding: "12px", margin: "8px 0" }}>
                    Patient créé avec succès — Dossier N° <strong>{numeroDossierCree}</strong>
                </div>
            )}

            {erreur && (
                <div style={{ background: "#f8d7da", padding: "12px", margin: "8px 0" }}>
                    {erreur}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom :</label><br/>
                    <input name="nom" value={form.nom} onChange={handleChange} required />
                    {champsErreurs.nom && <small style={{ color: "red" }}>{champsErreurs.nom}</small>}
                </div>

                <div>
                    <label>Prénom :</label><br/>
                    <input name="prenom" value={form.prenom} onChange={handleChange} required />
                    {champsErreurs.prenom && <small style={{ color: "red" }}>{champsErreurs.prenom}</small>}
                </div>

                <div>
                    <label>Date de naissance :</label><br/>
                    <input type="date" name="dateNaissance" value={form.dateNaissance} onChange={handleChange} />
                </div>

                <div>
                    <label>Sexe :</label><br/>
                    <select name="sexe" value={form.sexe} onChange={handleChange}>
                        <option value="MASCULIN">Masculin</option>
                        <option value="FEMININ">Féminin</option>
                    </select>
                </div>

                <div>
                    <label>Téléphone :</label><br/>
                    <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="770000000" />
                    {champsErreurs.telephone && <small style={{ color: "red" }}>{champsErreurs.telephone}</small>}
                </div>

                <div>
                    <label>Adresse :</label><br/>
                    <input name="addresse" value={form.addresse} onChange={handleChange} />
                </div>

                <div>
                    <label>Région :</label><br/>
                    <input name="region" value={form.region} onChange={handleChange} required />
                    {champsErreurs.region && <small style={{ color: "red" }}>{champsErreurs.region}</small>}
                </div>

                <div>
                    <label>Établissement :</label><br/>
                    <select name="etablissementId" value={form.etablissementId} onChange={handleChange} required>
                        <option value="">-- Sélectionner --</option>
                        {etablissements.map((e) => (
                            <option key={e.id} value={e.id}>{e.nom} ({e.region})</option>
                        ))}
                    </select>
                    {champsErreurs.etablissementId && <small style={{ color: "red" }}>{champsErreurs.etablissementId}</small>}
                </div>

                <br/>
                <button type="submit">Créer le patient</button>
            </form>
        </div>
    );
};

export default PatientForm;
