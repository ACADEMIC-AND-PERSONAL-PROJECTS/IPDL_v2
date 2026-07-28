const DiagnosticIA = ({ diagnostic, scoreConfiance, recommandations, disclaimer, diagnosticIa }) => {

    // Supporte deux modes : objet complet (depuis consultation) ou champs séparés (depuis /api/ai/analyser)
    const texteDiagnostic = diagnostic || (diagnosticIa || "").split("\n\nRecommandations :")[0] || "";
    const texteRecommandations = recommandations || (
        diagnosticIa && diagnosticIa.includes("Recommandations :")
            ? diagnosticIa.split("Recommandations :")[1]?.split("\n\n")[0]
            : ""
    );
    const texteDisclaimer = disclaimer || (
        diagnosticIa && diagnosticIa.includes("n'est pas un diagnostic")
            ? diagnosticIa.substring(diagnosticIa.indexOf("Ceci n'est pas"))
            : ""
    );

    if (!texteDiagnostic && !texteRecommandations) return null;

    const score = scoreConfiance != null ? scoreConfiance : null;

    return (
        <div style={{
            border: "2px solid #f57c00",
            borderLeft: "6px solid #e65100",
            borderRadius: "8px",
            padding: "16px 20px",
            margin: "12px 0",
            background: "linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%)",
            fontFamily: "system-ui, sans-serif"
        }}>
            {/* En-tête */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                borderBottom: "1px solid #ffe0b2",
                paddingBottom: "8px"
            }}>
                <span style={{ fontWeight: 700, fontSize: "1.05em", color: "#e65100" }}>
                    🧠 Analyse IA
                </span>
                {score !== null && (
                    <span style={{
                        background: score >= 0.7 ? "#c8e6c9" : score >= 0.4 ? "#fff9c4" : "#ffcdd2",
                        color: score >= 0.7 ? "#2e7d32" : score >= 0.4 ? "#f57f17" : "#c62828",
                        padding: "3px 12px",
                        borderRadius: "20px",
                        fontSize: "0.85em",
                        fontWeight: 600
                    }}>
                        Confiance : {(score * 100).toFixed(0)}%
                    </span>
                )}
            </div>

            {/* Diagnostic */}
            {texteDiagnostic && (
                <div style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: texteRecommandations ? "12px" : 0
                }}>
                    <strong style={{ color: "#e65100" }}>Diagnostic :</strong>{" "}
                    {texteDiagnostic}
                </div>
            )}

            {/* Recommandations */}
            {texteRecommandations && (
                <div style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    color: "#333",
                    marginBottom: texteDisclaimer ? "12px" : 0,
                    padding: "10px 14px",
                    background: "#fff",
                    borderRadius: "6px",
                    border: "1px dashed #ffe0b2"
                }}>
                    <strong style={{ color: "#e65100" }}>Recommandations :</strong>{" "}
                    {texteRecommandations}
                </div>
            )}

            {/* Disclaimer */}
            {texteDisclaimer && (
                <div style={{
                    fontStyle: "italic",
                    fontSize: "0.85em",
                    color: "#888",
                    lineHeight: 1.5,
                    whiteSpace: "pre-wrap",
                    borderTop: "1px solid #ffe0b2",
                    paddingTop: "10px",
                    marginTop: "4px"
                }}>
                    {texteDisclaimer}
                </div>
            )}
        </div>
    );
};

export default DiagnosticIA;
