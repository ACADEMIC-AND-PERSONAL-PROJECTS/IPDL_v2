import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setChargement(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token: jwt, role, message } = response.data;

      // Stocker le token en mémoire
      window.__token = jwt;
      setToken(jwt);
      setUser({ email, role });
      navigate("/dashboard");
      return { succes: true };
    } catch (error) {
      const message =
        error.response?.data?.erreur || "Email ou mot de passe incorrect";
      return { succes: false, message };
    } finally {
      setChargement(false);
    }
  };

  const logout = () => {
    window.__token = null;
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  const estConnecte = !!token;

  return (
    <AuthContext.Provider value={{ user, token, chargement, login, logout, estConnecte }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
