import { HiOutlineSparkles, HiOutlineShieldExclamation } from "react-icons/hi2";

function DiagnosticIA({ diagnostic, scoreConfiance, disclaimer }) {
  if (!diagnostic) return null;

  const scorePercent = Math.round(scoreConfiance * 100);

  const niveau =
    scorePercent >= 70
      ? { label: "Élevé", bg: "bg-leaf-soft", text: "text-leaf", ring: "ring-1 ring-leaf-soft" }
      : scorePercent >= 40
        ? { label: "Modéré", bg: "bg-warn-soft", text: "text-warn", ring: "ring-1 ring-warn-faint" }
        : { label: "Faible", bg: "bg-danger-soft", text: "text-danger", ring: "ring-1 ring-danger-faint" };

  return (
    <div className="mt-5 overflow-hidden rounded-2xl border border-bloom-faint bg-white shadow-soft animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5 bg-bloom-soft opacity-90">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bloom text-white shadow-sm shadow-bloom/20">
            <HiOutlineSparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">Analyse IA</p>
            <p className="text-xs text-ink-muted">Diagnostic assisté par intelligence artificielle</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${niveau.bg} ${niveau.text} ring-1 ${niveau.ring}`}
        >
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${niveau.text === "text-leaf" ? "bg-leaf" : niveau.text === "text-warn" ? "bg-warn" : "bg-danger"}`} />
          Confiance {scorePercent}% — {niveau.label}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-[14px] leading-relaxed text-ink-soft">{diagnostic}</p>

        {disclaimer && (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-warm-soft border border-warm-faint px-4 py-3 opacity-80">
            <HiOutlineShieldExclamation className="h-4 w-4 shrink-0 text-warm mt-0.5" />
            <p className="text-xs leading-relaxed text-warm-hover">{disclaimer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiagnosticIA;
