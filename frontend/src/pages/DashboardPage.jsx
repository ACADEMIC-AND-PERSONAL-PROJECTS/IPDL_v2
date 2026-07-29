import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
  AreaChart, Area,
} from "recharts";
import NavBar from "../components/NavBar";
import { analyticsService } from "../services/analyticsService";
import {
  HiOutlineUserGroup,
  HiOutlineClipboardDocumentCheck,
  HiOutlineCalendarDays,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

// ── Palettes ──
const COULEURS_STATUT = {
  EN_ATTENTE: "#e8a020",
  ANALYSEE: "#2d9f6d",
  CLOTUREE: "#a3afbd",
};

const COULEURS_REGIONS = [
  "#1a6ff5", "#7c5ce7", "#e74b4b", "#e8a020",
  "#2d9f6d", "#0ea5e9", "#c2644a", "#6366f1",
];

const COULEURS_ETABLISSEMENTS = [
  "#2d9f6d", "#1a6ff5", "#7c5ce7", "#e8a020",
  "#c2644a", "#0ea5e9", "#e74b4b", "#6366f1",
];

// ── Custom Tooltip ──
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3 shadow-xl">
      <p className="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-1">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-bold text-ink" style={{ color: entry.color }}>
          {entry.value.toLocaleString("fr-FR")} {entry.name}
        </p>
      ))}
    </div>
  );
}

// ── KPI Card ──
function CarteKpi({ label, valeur, unite, icon, accent }) {
  return (
    <div className="ss-kpi group">
      <div className="flex items-start justify-between mb-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.bg} ${accent.text} ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-extrabold text-ink tabular-nums">
          {typeof valeur === "number" ? valeur.toLocaleString("fr-FR") : valeur}
        </span>
        {unite && (
          <span className="text-sm font-medium text-ink-faint">{unite}</span>
        )}
      </div>
      <p className="text-[13px] font-medium text-ink-muted mt-1.5">{label}</p>
    </div>
  );
}

// ── Section Header ──
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      {subtitle && (
        <p className="text-xs text-ink-faint mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}

// ── Page ──
function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    analyticsService
      .getResume()
      .then(setStats)
      .catch(() => setErreur("Impossible de charger les statistiques."))
      .finally(() => setChargement(false));
  }, []);

  if (chargement)
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-[3px] border-brand-faint border-t-brand rounded-full animate-spin mb-5" />
          <p className="text-ink-muted text-sm font-medium">
            Chargement du tableau de bord…
          </p>
        </div>
      </div>
    );

  if (erreur)
    return (
      <div className="min-h-screen bg-canvas">
        <NavBar />
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-sm">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-soft text-danger ring-1 ring-danger-faint mb-5">
              <HiOutlineExclamationCircle className="h-8 w-8" />
            </div>
            <p className="text-danger font-semibold">{erreur}</p>
            <p className="text-ink-faint text-sm mt-2">
              Veuillez réessayer dans quelques instants.
            </p>
          </div>
        </div>
      </div>
    );

  const donneesStatut = stats.consultationsByStatut.map((s) => ({
    name: s.statut === "EN_ATTENTE" ? "En attente" : s.statut === "ANALYSEE" ? "Analysée" : "Clôturée",
    value: s.count,
    statut: s.statut,
  }));

  return (
    <div className="min-h-screen bg-canvas">
      <NavBar />
      <div className="ss-page">
        {/* Page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="ss-section-title">Tableau de bord</h1>
            <p className="ss-section-sub">
              Vue d'ensemble de l'activité de votre établissement
            </p>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 ss-stagger">
          <CarteKpi
            label="Patients"
            valeur={stats.totalPatients}
            icon={<HiOutlineUserGroup className="h-5 w-5" />}
            accent={{ bg: "bg-brand-soft", text: "text-brand" }}
          />
          <CarteKpi
            label="Consultations"
            valeur={stats.totalConsultations}
            icon={<HiOutlineClipboardDocumentCheck className="h-5 w-5" />}
            accent={{ bg: "bg-leaf-soft", text: "text-leaf" }}
          />
          <CarteKpi
            label="Ce mois"
            valeur={stats.consultationsMois}
            icon={<HiOutlineCalendarDays className="h-5 w-5" />}
            accent={{ bg: "bg-bloom-soft", text: "text-bloom" }}
          />
          <CarteKpi
            label="Taux IA"
            valeur={stats.tauxAnalyseIa}
            unite="%"
            icon={<HiOutlineSparkles className="h-5 w-5" />}
            accent={{ bg: "bg-warm-soft", text: "text-warm" }}
          />
          <CarteKpi
            label="Taux clôture"
            valeur={stats.tauxCloture}
            unite="%"
            icon={<HiOutlineCheckCircle className="h-5 w-5" />}
            accent={{ bg: "bg-leaf-soft", text: "text-leaf" }}
          />
          <CarteKpi
            label="Sans suivi"
            valeur={stats.patientsSansConsultation}
            icon={<HiOutlineExclamationCircle className="h-5 w-5" />}
            accent={{ bg: "bg-danger-soft", text: "text-danger" }}
          />
        </div>

        {/* ── Row 1: Patients par région | Consultations par région ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Patients par région — barres verticales */}
          <div className="ss-chart-card">
            <SectionHeader
              title="Patients par région"
              subtitle="Répartition géographique des dossiers"
            />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.patientsByRegion} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" vertical={false} />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={{ stroke: "#e5e9f0" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8f9fb" }} />
                <Bar dataKey="count" name="Patients" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {stats.patientsByRegion.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COULEURS_REGIONS[i % COULEURS_REGIONS.length]}
                      style={{ filter: "brightness(1)" }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Consultations par région — barres horizontales */}
          <div className="ss-chart-card">
            <SectionHeader
              title="Consultations par région"
              subtitle="Volume d'activité par zone géographique"
            />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.consultationsByRegion} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="region"
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                  width={85}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8f9fb" }} />
                <Bar dataKey="count" name="Consultations" fill="#7c5ce7" radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 2: Patients par établissement | Statuts ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Patients par établissement — barres horizontales */}
          <div className="ss-chart-card">
            <SectionHeader
              title="Patients par établissement"
              subtitle="Couverture par structure de santé"
            />
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.patientsByEtablissement} layout="vertical" barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="etablissement"
                  tick={{ fontSize: 10, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                  width={105}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8f9fb" }} />
                <Bar dataKey="count" name="Patients" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {stats.patientsByEtablissement.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COULEURS_ETABLISSEMENTS[i % COULEURS_ETABLISSEMENTS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Statuts — donut */}
          <div className="ss-chart-card">
            <SectionHeader
              title="Statut des consultations"
              subtitle="En attente / Analysées / Clôturées"
            />
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={donneesStatut}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  innerRadius={52}
                  paddingAngle={3}
                  strokeWidth={0}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  labelLine={{ stroke: "#e5e9f0", strokeWidth: 1 }}
                >
                  {donneesStatut.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COULEURS_STATUT[entry.statut] || "#a3afbd"}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Row 3: 6 derniers mois | Année en cours ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Area chart — 6 derniers mois */}
          <div className="ss-chart-card">
            <SectionHeader
              title="Consultations — 6 derniers mois"
              subtitle="Tendance récente de l'activité"
            />
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.consultations6DerniersMois}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1a6ff5" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#1a6ff5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={{ stroke: "#e5e9f0" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Consultations"
                  stroke="#1a6ff5"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ r: 4, fill: "#1a6ff5", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#1a6ff5", strokeWidth: 3, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Line chart — année en cours */}
          <div className="ss-chart-card">
            <SectionHeader
              title="Consultations — Année en cours"
              subtitle="Évolution mensuelle"
            />
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={stats.consultationsParMoisAnnee}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={{ stroke: "#e5e9f0" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "#6b7a8d" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Consultations"
                  stroke="#7c5ce7"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#7c5ce7", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#7c5ce7", strokeWidth: 3, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
