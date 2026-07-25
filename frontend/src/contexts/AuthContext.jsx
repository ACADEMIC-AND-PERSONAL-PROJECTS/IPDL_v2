import { useState, createContext, useContext } from "react";
import { login as loginService, register as registerService } from "../services/authService";

// Objectif: Centraliser toute la logique liee a l'authentification afin que tous les composant de l'application puisse y acceder
// Creation du contexte afin que n'importe quel composant puisse acceder aux donnees
const AuthContext = createContext(null);

// Fonction pour gerer toute la logique d'authentification & inscription cote front
export const AuthProvider = ({ children }) => {

    // Variable pour stocker les donnees d'authentication/inscription
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);

    // Gestion de l'authentification
    const login = async (email, password) => {
        const data = await loginService(email, password);
        setToken(data.token);
        setUser({email: data.email, role: data.role});
        return data;
    };

    // Gestion de l'inscription
    const register = async (nom, prenom, email, password, role, etablissementId) => {
        const data = await registerService(nom, prenom, email, password, role, etablissementId);
        setToken(data.token);
        setUser({email: data.email, role: data.role});
        return data;
    }

    // Remettre a null les variables lors de la deconnexion
    const logout = () => {
        setToken(null);
        setUser(null);
    };

    // Ajouter le bearer token automatiquement
    const getAuthHeader = () => ({
        Authorization: `Bearer ${token}`
    });

    return (
        // Stockage des donnees au niveau du context
        <AuthContext.Provider value={{token, user, login, register, logout, getAuthHeader}}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);