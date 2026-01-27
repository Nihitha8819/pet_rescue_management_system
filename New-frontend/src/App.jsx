import { Routes, Route } from "react-router-dom";

import { NotificationsProvider } from "./contexts/NotificationsContext";
import { MatchProvider } from "./contexts/MatchContext";
import { PetProvider } from "./contexts/PetContext";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./Components/common/header";
import AdoptPage from "./pages/AdoptPage";
import LostFoundPage from "./pages/LostFound";
import ReportPetPage from "./pages/ReportPet";
import UserDashboard from "./pages/UserDashboard";
import AdminReports from "./pages/AdminPage";
import RegisterPetPage from "./pages/RegisterPet";
import FavoritesPage from "./pages/FavoritesPage";
import PetDetail from "./Components/Pets/PetDetail";
import AdoptionRequest from "./pages/AdoptionRequest";
import LostFoundResponse from "./pages/LostFoundResponse";
import SettingsPage from "./pages/SettingsPage";
import EditPetPage from "./pages/EditPetPage";
import About from "./pages/About";
import ProtectedRoute from "./ProtectedRoute";

const App = () => {
  return (
      <NotificationsProvider>
        <MatchProvider>
          <PetProvider>

            <Routes>

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              <Route element={<MainLayout />}>
                <Route path="/" element={<Header />} />
                <Route path="/adopt" element={<AdoptPage />} />
                <Route path="/adopt/:id" element={<PetDetail />} />
                <Route path="/lost-found/:id" element={<PetDetail />} />
                <Route path="/adopt/:id/request" element={<AdoptionRequest />} />
                <Route path="/lost-found/:id/respond" element={<LostFoundResponse />} />
                <Route path="/lost-found" element={<LostFoundPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/about" element={<About />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/pets/edit/:id"element={<EditPetPage />}/>
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/reportPet" element={<ReportPetPage />} />
                <Route path="/registerPet" element={<RegisterPetPage />} />
                <Route path="/admin" element={<AdminReports />} />
              </Route>

            </Routes>

          </PetProvider>
        </MatchProvider>
      </NotificationsProvider>
  );
};

export default App;
