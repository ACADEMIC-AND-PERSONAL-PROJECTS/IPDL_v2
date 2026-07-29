import { Routes, Route } from "react-router-dom";
import RouteProtegee from "./components/RouteProtegee";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PatientsPage from "./pages/PatientsPage";
import ConsultationsPage from "./pages/ConsultationsPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
