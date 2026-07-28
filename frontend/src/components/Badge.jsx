const STATUT_STYLES = {
  EN_ATTENTE: { label: "En attente", bg: "bg-yellow-100", text: "text-yellow-700" },
  ANALYSEE: { label: "Analysée", bg: "bg-green-100", text: "text-green-700" },
  CLOTUREE: { label: "Clôturée", bg: "bg-gray-100", text: "text-gray-700" },
};

function Badge({ statut }) {
  const style = STATUT_STYLES[statut] || { label: statut, bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export default Badge;
