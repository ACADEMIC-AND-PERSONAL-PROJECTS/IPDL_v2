import { Routes, Route, Navigate } from "react-router-dom";
import RouteProtegee from "./components/RouteProtegee";
import LoginPage from "./pages/LoginPage";
import PatientsPage from "./pages/PatientsPage";
import ConsultationsPage from "./pages/ConsultationsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/patients" element={
        <RouteProtegee><PatientsPage /></RouteProtegee>
      } />
      <Route path="/consultations" element={
        <RouteProtegee><ConsultationsPage /></RouteProtegee>
      } />
      <Route path="/dashboard" element={
        <RouteProtegee><DashboardPage /></RouteProtegee>
      } />
    </Routes>
  );
}

export default App;
