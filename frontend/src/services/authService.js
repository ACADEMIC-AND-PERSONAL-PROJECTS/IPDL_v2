import axios from "axios";

// URL vers l'api spring boot
const API_URL = "http://localhost:8080/api/auth";

// Fonction pour s'inscrire
export const register = async (nom, prenom, email, password, role = 'AGENT', etablissementId) => {

    // Les donnees a envoye lors de la creation de compte
    const user = {
        nom,
        prenom,
        email,
        password,
        role,
        etablissementId
    };

    // Requete HTTP vers le backend
    const response = await axios.post(`${API_URL}/register`, user);

    // Reponse du backend avec un token inclu
    return response.data;

}

// Fonction pour s'authentifier
export const login = async (email, password) => {
    
    // Champs d'authentifications
    const user = {
        email,
        password
    };

    // Requete HTTP
    const response = await axios.post(`${API_URL}/login`, user);

    // Retourner la reponse
    return response.data;

}