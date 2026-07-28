import NavBar from "../components/NavBar";

function ConsultationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-gray-800 mb-6">Consultations</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-400">
          <p>Les consultations seront chargées depuis l'API</p>
          <p className="text-sm mt-2">Lab React 2 — connexion Axios + JWT</p>
        </div>
      </div>
    </div>
  );
}

export default ConsultationsPage;
