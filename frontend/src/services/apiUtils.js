/**
 * Extrait un message lisible depuis une erreur Axios.
 * Gère les 400 (validation), 404 (introuvable), et les erreurs réseau.
 */
export const extractErrorMessage = (err) => {

    // Pas de réponse du serveur (réseau, CORS, serveur down)
    if (!err.response) {
        return "Impossible de contacter le serveur. Vérifiez que l'API est démarrée.";
    }

    const { status, data } = err.response;

    // 400 — erreurs de validation renvoyées comme { champ: "message", ... }
    if (status === 400 && typeof data === "object" && data !== null) {
        const messages = Object.entries(data)
            .map(([field, msg]) => `${field} : ${msg}`)
            .join(" | ");
        return messages || "Requête invalide.";
    }

    // 404 — ressource introuvable
    if (status === 404) {
        return data?.erreur || "Ressource introuvable.";
    }

    // 403 — accès refusé
    if (status === 403) {
        return data?.erreur || "Accès refusé. Vérifiez vos permissions.";
    }

    // 401 — non authentifié
    if (status === 401) {
        return data?.erreur || "Session expirée. Reconnectez-vous.";
    }

    // 500 — erreur serveur
    if (status >= 500) {
        return data?.erreur || "Erreur interne du serveur.";
    }

    // Fallback
    return data?.erreur || data?.message || `Erreur inattendue (${status}).`;
};

/**
 * Extrait les erreurs champ par champ depuis une réponse 400.
 * Retourne un objet { nom: "message", prenom: "message", ... } ou null.
 */
export const extractFieldErrors = (err) => {
    if (err.response?.status === 400 && typeof err.response?.data === "object") {
        return err.response.data;
    }
    return null;
};
