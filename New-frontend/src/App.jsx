import React from "react";
import { Route, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { MatchProvider } from "./contexts/MatchContext";
import { PetProvider } from "./contexts/PetContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SearchPets from "./pages/SearchPets";
import ReportPetPage from "./pages/ReportPet";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/adminlogin";
import AdminReports from "./pages/AdminPage";
import RegisterPetPage from "./pages/RegisterPet";
import LostFoundPage from "./pages/LostFound";
import EditPetPage from "./pages/EditPetPage";
import AdoptPage from "./pages/AdoptPage";
import ManageUsers from "./pages/ManageUsers"
import PetDetail from "./Components/Pets/PetDetail";

import Navigation from "./Components/common/Navigation";
import Header from "./Components/common/header";  
import Footer from "./Components/common/footer";

const App = () => {
  return (
      <AuthProvider>
        <NotificationProvider>
          <MatchProvider>
            <PetProvider>
              <div className="App">             
                <Navigation />
                <main className="page">
                  <Routes>
                    <Route path="/" element={<Header />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/adminlogin" element={<AdminLogin />} />
                    <Route path="/SearchPets" element={<SearchPets />} />
                    <Route path="/ReportPet" element={<ReportPetPage />} />
                    <Route path="/AdoptPage" element={<AdoptPage />} />
                    <Route path="/RegisterPet" element={<RegisterPetPage />} />
                    <Route path="/LostFound" element={<LostFoundPage />} />
                    <Route path="/UserDashboard" element={<UserDashboard />} />
                    <Route path="/pets/edit/:id" element={<EditPetPage />} />
                    <Route path="/ManageUsers" element={<ManageUsers />} />
                    <Route path="/PetDetail" element={<PetDetail />} />
                    <Route path="/AdminPage" element={<AdminReports />} />
                  </Routes>
                </main>

                <Footer />
              </div>
            </PetProvider>
          </MatchProvider>
        </NotificationProvider>
      </AuthProvider>
  );
};

export default App;
