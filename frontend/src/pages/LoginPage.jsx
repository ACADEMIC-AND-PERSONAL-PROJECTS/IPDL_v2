import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");
  const { login, chargement } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");

    const resultat = await login(email, password);
    if (!resultat.succes) {
      setErreur(resultat.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-canvas">
      <div className="w-full max-w-md animate-scale-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-display text-3xl font-bold tracking-tight text-ink hover:text-brand transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-md">
              S
            </span>
            SénSanté <span className="text-brand">Pro</span>
          </Link>
          <p className="mt-2 text-[15px] text-ink-muted">
            Plateforme de santé communautaire
          </p>
        </div>

        {/* Card */}
        <div className="ss-panel p-8 sm:p-10 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-ink">
              Bienvenue
            </h1>
            <p className="mt-1.5 text-[14px] text-ink-muted">
              Accès sécurisé pour les professionnels de santé
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="ss-label" htmlFor="email">
                Email professionnel
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fatou.diallo@hopital.sn"
                  required
                  autoComplete="email"
                  className="ss-input pl-12"
                />
              </div>
            </div>

            <div>
              <label className="ss-label" htmlFor="password">
                Mot de passe
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="ss-input pl-12"
                />
              </div>
            </div>

            {erreur && (
              <div className="flex items-start gap-3 rounded-xl bg-danger-soft border border-danger-faint p-4 text-sm text-danger animate-fade-in">
                <HiOutlineExclamationTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{erreur}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={chargement}
              className="ss-btn-primary w-full group mt-2"
            >
              {chargement ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connexion en cours…
                </span>
              ) : (
                <>
                  Se connecter
                  <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[14px] text-ink-muted">
          Pas encore de compte ?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand hover:text-brand-hover transition-colors"
          >
            Demander un accès
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link
            to="/"
            className="text-[13px] font-medium text-ink-faint hover:text-ink-muted transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
