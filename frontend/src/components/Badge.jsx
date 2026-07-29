const STATUT_CONFIG = {
  EN_ATTENTE: {
    label: "En attente",
    dot: "bg-warn",
    classes: "bg-warn-soft text-warn border-warn-faint",
  },
  ANALYSEE: {
    label: "Analysée",
    dot: "bg-leaf",
    classes: "bg-leaf-soft text-leaf border-leaf-faint",
  },
  CLOTUREE: {
    label: "Clôturée",
    dot: "bg-ink-faint",
    classes: "bg-surface text-ink-muted border-line",
  },
};

function Badge({ statut }) {
  const config = STATUT_CONFIG[statut] || {
    label: statut || "Inconnu",
    dot: "bg-ink-faint",
    classes: "bg-surface text-ink-muted border-line",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.classes}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export default Badge;
