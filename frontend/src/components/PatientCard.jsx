// PatientCard.jsx — composant réutilisable
function PatientCard({ nom, prenom, region, numeroDossier }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">
            {prenom} {nom}
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Région : {region}
          </p>
        </div>
        <span className="bg-blue-100 text-blue-700 text-xs font-mono px-2 py-1 rounded">
          {numeroDossier}
        </span>
      </div>
    </div>
  );
}

export default PatientCard;
