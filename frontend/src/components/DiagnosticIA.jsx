function DiagnosticIA({ diagnostic, scoreConfiance, disclaimer }) {
  if (!diagnostic) return null;

  const scorePercent = Math.round(scoreConfiance * 100);
  const couleurScore =
    scorePercent >= 70
      ? "text-green-600"
      : scorePercent >= 40
        ? "text-orange-500"
        : "text-red-500";

  return (
    <div className="border border-orange-200 rounded-lg bg-orange-50 p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-orange-600 font-semibold text-sm">Analyse IA</span>
        <span className={`font-bold text-sm ${couleurScore}`}>
          Confiance : {scorePercent}%
        </span>
      </div>

      <p className="text-gray-800 text-sm leading-relaxed mb-3">{diagnostic}</p>

      {disclaimer && (
        <p className="text-xs text-gray-400 italic border-t border-orange-200 pt-2 mt-2">
          {disclaimer}
        </p>
      )}
    </div>
  );
}

export default DiagnosticIA;
