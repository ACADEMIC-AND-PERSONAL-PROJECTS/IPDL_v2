import axios from "axios";

// Instance Axios partagée pour tout SénSanté Pro
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Intercepteur de requête — ajoute le JWT automatiquement
api.interceptors.request.use(
  (config) => {
    // Le token est stocké dans window.__token
    const token = window.__token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Pages publiques — ne pas rediriger vers login si on y est déjà
const PUBLIC_PATHS = ["/", "/login", "/register"];

function isPublicPage() {
  return PUBLIC_PATHS.includes(window.location.pathname);
}

// Intercepteur de réponse — gère les 401 globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide — rediriger vers login
      window.__token = null;
      // Ne pas boucler : si déjà sur une page publique, on laisse le caller gérer
      if (!isPublicPage()) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
