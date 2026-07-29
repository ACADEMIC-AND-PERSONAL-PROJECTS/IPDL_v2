import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineSparkles,
  HiOutlineChartPie,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineHeart,
} from "react-icons/hi2";

const features = [
  {
    icon: <HiOutlineUserGroup className="h-6 w-6" />,
    title: "Dossiers patients",
    desc: "Enregistrez et retrouvez chaque patient en un instant : identité, région, établissement et numéro de dossier unique.",
    color: "from-brand to-accent",
    bg: "bg-brand-soft",
    text: "text-brand",
  },
  {
    icon: <HiOutlineClipboardDocumentCheck className="h-6 w-6" />,
    title: "Consultations",
    desc: "Saisissez les symptômes, consignez les notes cliniques et suivez l'évolution de chaque consultation en temps réel.",
    color: "from-leaf to-emerald-400",
    bg: "bg-leaf-soft",
    text: "text-leaf",
  },
  {
    icon: <HiOutlineSparkles className="h-6 w-6" />,
    title: "Aide au diagnostic IA",
    desc: "Une intelligence artificielle analyse les symptômes et suggère des orientations pour assister le médecin dans sa décision.",
    color: "from-bloom to-violet-400",
    bg: "bg-bloom-soft",
    text: "text-bloom",
  },
  {
    icon: <HiOutlineChartPie className="h-6 w-6" />,
    title: "Pilotage d'activité",
    desc: "Visualisez les volumes par région, le taux d'analyse IA, le taux de clôture et identifiez les patients sans suivi.",
    color: "from-warm to-orange-400",
    bg: "bg-warm-soft",
    text: "text-warm",
  },
];

const steps = [
  {
    step: "01",
    title: "Créez votre compte",
    desc: "Inscrivez-vous avec votre email professionnel et rejoignez votre établissement de santé en quelques secondes.",
  },
  {
    step: "02",
    title: "Enregistrez vos patients",
    desc: "Ajoutez des dossiers patients complets et démarrez des consultations avec analyse IA intégrée.",
  },
  {
    step: "03",
    title: "Pilotez votre activité",
    desc: "Consultez les tableaux de bord, suivez les indicateurs clés et améliorez la prise en charge.",
  },
];

export default function LandingPage() {
  const { estConnecte } = useAuth();

  if (estConnecte) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen font-sans antialiased bg-canvas">
      {/* ── Navbar ── */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-white/80 backdrop-blur-xl saturate-150">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white text-sm font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
              S
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-ink">
              SénSanté <span className="text-brand">Pro</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="ss-btn-ghost text-sm font-medium"
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="ss-btn-primary !py-2.5 !px-5 text-sm hidden sm:flex"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 sm:pt-40 sm:pb-24">
        {/* Abstract background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-brand-soft blur-3xl animate-float opacity-60" />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-warm-soft blur-3xl animate-float opacity-40" style={{ animationDelay: "3s" }} />
          <div className="absolute -bottom-20 right-1/4 w-[350px] h-[350px] rounded-full bg-leaf-soft blur-3xl animate-float opacity-30" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-faint bg-brand-soft px-4 py-1.5 text-[13px] font-medium text-brand animate-fade-up opacity-90">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Plateforme de santé communautaire au Sénégal
          </div>

          <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight text-ink sm:text-6xl lg:text-7xl leading-[1.08] animate-fade-up" style={{ animationDelay: "80ms" }}>
            La santé
            <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-accent to-brand-deep">
              {" "}communautaire
            </span>
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            réinventée.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl animate-fade-up" style={{ animationDelay: "160ms" }}>
            Une plateforme pensée pour les hôpitaux, centres et postes de santé sénégalais.
            Centralisez les dossiers patients, bénéficiez d'une aide au diagnostic intelligente
            et pilotez votre activité en toute simplicité.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <Link
              to="/register"
              className="ss-btn-primary text-[15px] !px-8 !py-4 w-full sm:w-auto"
            >
              Démarrer maintenant
              <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/login"
              className="ss-btn-secondary text-[15px] !px-8 !py-4 w-full sm:w-auto"
            >
              Accéder à l'espace pro
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-ink-faint animate-fade-up" style={{ animationDelay: "320ms" }}>
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="h-5 w-5 text-leaf" />
              <span>Sécurisé & conforme</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineHeart className="h-5 w-5 text-warm" />
              <span>Conçu pour le Sénégal</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineSparkles className="h-5 w-5 text-bloom" />
              <span>IA médicale intégrée</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="ss-label text-brand">Fonctionnalités</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mt-4 text-[15px] text-ink-muted leading-relaxed max-w-lg mx-auto">
            Un flux de travail fluide, du premier accueil au diagnostic, jusqu'au pilotage de votre établissement.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-line bg-white p-8 shadow-soft transition-all duration-500 hover:shadow-lift hover:border-brand-faint"
              style={{ animation: `fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both`, animationDelay: `${i * 80}ms` }}
            >
              {/* Subtle gradient accent on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-brand-soft/30 via-transparent to-transparent" />

              <div className="relative">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg} ${f.text} ring-1 ring-black/5 mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{f.title}</h3>
                <p className="text-[14px] leading-relaxed text-ink-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative bg-surface-alt border-y border-line">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center mb-14">
            <span className="ss-label text-warm">Comment ça marche</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Opérationnel en trois étapes
            </h2>
            <p className="mt-4 text-[15px] text-ink-muted leading-relaxed max-w-lg mx-auto">
              Une mise en route rapide pour que vous puissiez vous concentrer sur l'essentiel : vos patients.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="relative text-center"
                style={{ animation: `fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both`, animationDelay: `${i * 100}ms` }}
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white border border-line shadow-soft mb-6 font-display text-2xl font-bold text-brand">
                  {s.step}
                </div>
                <h3 className="text-lg font-bold text-ink mb-2">{s.title}</h3>
                <p className="text-[14px] leading-relaxed text-ink-muted max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-brand to-brand-deep p-10 sm:p-16 text-center shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à transformer votre activité ?
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
              Rejoignez les professionnels de santé qui utilisent déjà SénSanté Pro
              pour la gestion de leurs consultations et le suivi de leurs patients.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-[15px] font-semibold text-brand transition-all duration-300 hover:bg-white/95 hover:shadow-lg active:scale-[0.97]"
              >
                Créer un compte gratuit
                <HiOutlineArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl px-8 py-4 text-[15px] font-semibold text-white/80 transition-all duration-300 hover:text-white hover:bg-white/10"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-white font-display text-xs font-bold">
              S
            </span>
            <span className="font-display font-semibold text-ink">
              SénSanté <span className="text-brand">Pro</span>
            </span>
          </div>
          <p className="text-[13px] text-ink-faint">
            &copy; {new Date().getFullYear()} Plateforme de santé communautaire du Sénégal. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
