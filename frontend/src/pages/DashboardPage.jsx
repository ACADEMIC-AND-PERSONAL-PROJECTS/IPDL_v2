import { useAuth } from "../contexts/AuthContext";

const DashboardPage = () => {

    const { user } = useAuth();

    return (
        <div>
            <h2>Tableau de bord</h2>
            <p>Connecté en tant que <strong>{user?.email}</strong> ({user?.role}).</p>
        </div>
    );
};

export default DashboardPage;
