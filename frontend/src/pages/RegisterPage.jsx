import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { extractErrorMessage } from "../services/apiUtils";
import api from "../services/api";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineBuildingOffice,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

function RegisterPage() {
  const navigate = useNavigate();
  const [etablissements, setEtablissements] = useState([]);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    role: "AGENT",
    etablissementId: "",
  });

  useEffect(() => {
    api
      .get("/api/auth/etablissements")
      .then((r) => setEtablissements(Array.isArray(r.data) ? r.data : []))
      .catch(() => setEtablissements([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setChargement(true);
    try {
      await register(
        form.nom,
        form.prenom,
        form.email,
        form.password,
        form.role,
        Number(form.etablissementId)
      );
      setSucces(true);
    } catch (err) {
      setErreur(extractErrorMessage(err));
    } finally {
      setChargement(false);
    }
  };

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-canvas">
        <div className="w-full max-w-md animate-scale-in text-center">
          <div className="ss-panel p-10 flex flex-col items-center bg-white">
            <div className="h-20 w-20 rounded-2xl bg-leaf-soft flex items-center justify-center mb-6 ring-4 ring-leaf-faint">
              <HiOutlineCheckCircle className="h-10 w-10 text-leaf" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">
              Compte créé avec succès
            </h1>
            <p className="mt-3 text-[15px] text-ink-muted leading-relaxed">
              Votre compte professionnel est prêt. Vous pouvez maintenant vous
              connecter et accéder à la plateforme.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="ss-btn-primary mt-8 w-full"
            >
              Aller à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-canvas">
      <div className="w-full max-w-lg animate-fade-up my-8">
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
            Rejoignez votre établissement de santé
          </p>
        </div>

        {/* Card */}
        <div className="ss-panel p-8 sm:p-10 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-display font-bold text-ink">
              Inscription
            </h1>
            <p className="mt-1.5 text-[14px] text-ink-muted">
              Créez votre compte professionnel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ss-label" htmlFor="prenom">
                  Prénom
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5" />
                  <input
                    id="prenom"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    className="ss-input pl-12"
                    placeholder="Fatou"
                  />
                </div>
              </div>
              <div>
                <label className="ss-label" htmlFor="nom">
                  Nom
                </label>
                <input
                  id="nom"
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="ss-input"
                  placeholder="Diallo"
                />
              </div>
            </div>

            <div>
              <label className="ss-label" htmlFor="email">
                Email professionnel
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="fatou.diallo@hopital.sn"
                  required
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
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="ss-input pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="ss-label" htmlFor="role">
                Rôle assigné
              </label>
              <div className="relative">
                <HiOutlineShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5 pointer-events-none" />
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="ss-select pl-12"
                >
                  <option value="AGENT">Agent de santé</option>
                  <option value="MEDECIN">Médecin</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </div>
            </div>

            <div>
              <label className="ss-label" htmlFor="etablissementId">
                Établissement
              </label>
              <div className="relative">
                <HiOutlineBuildingOffice className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint h-5 w-5 pointer-events-none" />
                <select
                  id="etablissementId"
                  name="etablissementId"
                  value={form.etablissementId}
                  onChange={handleChange}
                  required
                  className="ss-select pl-12"
                >
                  <option value="">Sélectionner une structure…</option>
                  {etablissements.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nom} ({e.region})
                    </option>
                  ))}
                </select>
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
              className="ss-btn-primary w-full mt-4"
            >
              {chargement ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Création en cours…
                </span>
              ) : (
                "Créer mon compte professionnel"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[14px] text-ink-muted">
          Déjà inscrit ?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand hover:text-brand-hover transition-colors"
          >
            Me connecter
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

export default RegisterPage;
