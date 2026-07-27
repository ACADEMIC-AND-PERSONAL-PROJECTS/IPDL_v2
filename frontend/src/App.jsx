import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import PatientsPage from "./pages/PatientsPage";
import PatientForm from "./pages/PatientForm";

function App() {

    const { token, logout, user } = useAuth();
    const [page, setPage] = useState("patients");

    if (!token) {
        return <LoginPage />;
    }

    return (
        <div style={{ padding: "16px" }}>
            <div style={{ marginBottom: "16px", padding: "8px", background: "#eee" }}>
                Connecté : <strong>{user?.email}</strong> ({user?.role})
                {" | "}
                <button onClick={() => setPage("patients")}>Liste patients</button>
                {" | "}
                <button onClick={() => setPage("form")}>Nouveau patient</button>
                {" | "}
                <button onClick={logout}>Déconnexion</button>
            </div>

            {page === "patients" && <PatientsPage />}
            {page === "form" && <PatientForm />}
        </div>
    );
}

export default App;
