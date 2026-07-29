import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area,
} from "recharts";
import NavBar from "../components/NavBar";
import { analyticsService } from "../services/analyticsService";

const COULEURS_STATUT = {
  EN_ATTENTE: "#FCD34D",
  ANALYSEE: "#34D399",
  CLOTUREE: "#9CA3AF",
};

const COULEURS_REGIONS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444", "#6366F1", "#14B8A6"];

function CarteKpi({ label, valeur, unite, couleur, icone }) {
  return (
    <div className={`rounded-xl p-5 ${couleur} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icone}</span>
      </div>
      <p className="text-3xl font-bold">{valeur}</p>
      {unite && <p className="text-sm opacity-75">{unite}</p>}
      <p className="text-sm font-medium mt-2 opacity-80">{label}</p>
    </div>
  );
}

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

  if (chargement) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    </div>
  );

  if (erreur) return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex items-center justify-center py-24">
        <div className="text-center bg-red-50 rounded-xl p-8 max-w-md">
          <span className="text-4xl">⚠️</span>
          <p className="text-red-500 mt-3">{erreur}</p>
        </div>
      </div>
    </div>
  );

  const donneesStatut = stats.consultationsByStatut.map((s) => ({
    name: s.statut,
    value: s.count,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
            <p className="text-sm text-gray-400 mt-1">Vue d'ensemble de l'activité SénSanté Pro</p>
          </div>
        </div>

        {/* KPIs — 6 cartes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <CarteKpi
            label="Patients"
            valeur={stats.totalPatients}
            icone="👥"
            couleur="bg-blue-50 text-blue-700 border border-blue-100"
          />
          <CarteKpi
            label="Consultations"
            valeur={stats.totalConsultations}
            icone="🩺"
            couleur="bg-green-50 text-green-700 border border-green-100"
          />
          <CarteKpi
            label="Ce mois"
            valeur={stats.consultationsMois}
            icone="📅"
            couleur="bg-purple-50 text-purple-700 border border-purple-100"
          />
          <CarteKpi
            label="Taux IA"
            valeur={stats.tauxAnalyseIa}
            unite="%"
            icone="🤖"
            couleur="bg-orange-50 text-orange-700 border border-orange-100"
          />
          <CarteKpi
            label="Taux clôture"
            valeur={stats.tauxCloture}
            unite="%"
            icone="✅"
            couleur="bg-emerald-50 text-emerald-700 border border-emerald-100"
          />
          <CarteKpi
            label="Sans suivi"
            valeur={stats.patientsSansConsultation}
            icone="🔍"
            couleur="bg-red-50 text-red-700 border border-red-100"
          />
        </div>

        {/* Rangée 1 : Patients par région | Consultations par région */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Patients par région</h2>
            <p className="text-xs text-gray-400 mb-5">Répartition géographique des dossiers</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.patientsByRegion}>
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                  {stats.patientsByRegion.map((_, i) => (
                    <Cell key={i} fill={COULEURS_REGIONS[i % COULEURS_REGIONS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Consultations par région</h2>
            <p className="text-xs text-gray-400 mb-5">Volume d'activité par zone</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.consultationsByRegion} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="region" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" name="Consultations" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rangée 2 : Patients par établissement | Statuts (camembert) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Patients par établissement</h2>
            <p className="text-xs text-gray-400 mb-5">Couverture par structure de santé</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.patientsByEtablissement} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="etablissement" tick={{ fontSize: 10 }} width={100} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="count" name="Patients" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Statut des consultations</h2>
            <p className="text-xs text-gray-400 mb-5">En attente / Analysées / Clôturées</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={donneesStatut}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={{ strokeWidth: 1 }}
                >
                  {donneesStatut.map((entry, index) => (
                    <Cell key={index} fill={COULEURS_STATUT[entry.name] || "#6B7280"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rangée 3 : 6 derniers mois | Année en cours (courbes côte à côte) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Consultations — 6 derniers mois</h2>
            <p className="text-xs text-gray-400 mb-5">Tendance récente</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={stats.consultations6DerniersMois}>
                <defs>
                  <linearGradient id="colorCount6" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="Consultations"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fill="url(#colorCount6)"
                  dot={{ r: 4, fill: "#3B82F6" }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">Consultations — Année en cours</h2>
            <p className="text-xs text-gray-400 mb-5">Évolution mensuelle</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.consultationsParMoisAnnee}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="mois" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Consultations"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#8B5CF6" }}
                  activeDot={{ r: 6 }}
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
