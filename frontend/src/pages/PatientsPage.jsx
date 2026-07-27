import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getAllPatients } from "../services/patientsService";
import { extractErrorMessage } from "../services/apiUtils";

const PatientsPage = () => {

    const { getAuthHeader } = useAuth();
    const [patients, setPatients] = useState([]);
    const [erreur, setErreur] = useState(null);
    const [chargement, setChargement] = useState(true);

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

    return (
        <div>
            <h2>Liste des patients</h2>

            {chargement && <p>Chargement...</p>}

            {erreur && (
                <div style={{ background: "#f8d7da", padding: "12px", margin: "8px 0" }}>
                    {erreur}
                    <br/>
                    <button onClick={chargerPatients} style={{ marginTop: "8px" }}>Réessayer</button>
                </div>
            )}

            {!chargement && !erreur && patients.length === 0 && (
                <p>Aucun patient enregistré.</p>
            )}

            {patients.map((p) => (
                <div key={p.id} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}>
                    <strong>{p.nom} {p.prenom}</strong>
                    <div>Dossier : <strong>{p.numeroDossier}</strong></div>
                    <div>Sexe : {p.sexe} | Né(e) le : {p.dateNaissance}</div>
                    <div>Tél : {p.telephone} | Région : {p.region}</div>
                    <div>Établissement : {p.etablissementNom} ({p.etablissementRegion})</div>
                </div>
            ))}
        </div>
    );
};

export default PatientsPage;
