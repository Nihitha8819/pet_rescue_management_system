import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MatchProvider } from './contexts/MatchContext';
import { PetProvider } from './contexts/PetContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchPets from './pages/SearchPets';
import ReportPet from './pages/ReportPet';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <MatchProvider>
            <PetProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/search" element={<SearchPets />} />
                    <Route path="/report-pet" element={<ReportPet />} />
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </PetProvider>
          </MatchProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;