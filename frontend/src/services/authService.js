import api from "./api";

// Fonction pour s'inscrire
export const register = async (nom, prenom, email, password, role = "AGENT", etablissementId) => {
  const user = { nom, prenom, email, password, role, etablissementId };
  const response = await api.post("/api/auth/register", user);
  return response.data;
};

// Fonction pour s'authentifier
export const login = async (email, password) => {
  const user = { email, password };
  const response = await api.post("/api/auth/login", user);
  return response.data;
};
