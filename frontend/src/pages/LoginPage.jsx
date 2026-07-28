import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Appel API dans le Lab React 2
    console.log("Login submitted");
    setErreur("Connexion à l'API dans le prochain lab.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800">SénSanté Pro</h1>
          <p className="text-gray-400 text-sm mt-1">
            Plateforme de santé communautaire
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="fatou.diallo@hopital.sn"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {erreur && (
            <p className="text-red-500 text-xs text-center">{erreur}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 text-white rounded-lg py-2 font-medium hover:bg-blue-800 transition-colors"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
