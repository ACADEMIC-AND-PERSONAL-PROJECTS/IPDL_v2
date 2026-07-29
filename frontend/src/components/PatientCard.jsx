const AVATAR_COLORS = [
  "bg-brand text-white",
  "bg-leaf text-white",
  "bg-bloom text-white",
  "bg-warm text-white",
  "bg-accent text-white",
];

function getInitials(prenom, nom) {
  return `${prenom?.charAt(0) || ""}${nom?.charAt(0) || ""}`.toUpperCase();
}

function getColorFromName(nom) {
  let hash = 0;
  for (let i = 0; i < (nom || "").length; i++) {
    hash = nom.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function PatientCard({ nom, prenom, region, numeroDossier }) {
  const initials = getInitials(prenom, nom);
  const avatarColor = getColorFromName(nom);

  return (
    <div className="group flex items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-soft transition-all duration-300 hover:shadow-lift hover:border-brand-faint">
      {/* Avatar */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${avatarColor} text-sm font-bold shadow-sm transition-transform duration-300 group-hover:scale-105`}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold text-ink truncate">
          {prenom} {nom}
        </h3>
        <p className="text-[13px] text-ink-muted mt-0.5">
          {region || "Région inconnue"}
        </p>
      </div>

      {/* Dossier number */}
      <div className="shrink-0">
        <span className="inline-flex items-center rounded-lg bg-brand-soft px-2.5 py-1 font-mono text-xs font-semibold text-brand">
          {numeroDossier || "—"}
        </span>
      </div>
    </div>
  );
}

export default PatientCard;
