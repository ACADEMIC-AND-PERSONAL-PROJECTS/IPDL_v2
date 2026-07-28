import PatientCard from "./components/PatientCard";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">
        SénSanté Pro — Patients
      </h1>
      <div className="space-y-3 max-w-xl">
        <PatientCard
          nom="Diallo"
          prenom="Fatou"
          region="Dakar"
          numeroDossier="SP-A1B2C3D4"
        />
        <PatientCard
          nom="Ndiaye"
          prenom="Ousmane"
          region="Thiès"
          numeroDossier="SP-E5F6G7H8"
        />
      </div>
    </div>
  );
}

export default App;
