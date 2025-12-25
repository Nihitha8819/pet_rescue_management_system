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
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import RegisterPet from './pages/RegisterPet';
import AdminReports from './pages/admin/AdminReports';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminPets from './pages/admin/AdminPets';
import AdminAdoptions from './pages/admin/AdminAdoptions';
import PetDetail from './components/pets/PetDetail';
import ChatBox from './components/ChatBox';
import { useAuth } from './contexts/AuthContext';


const ChatWrapper = () => {
  const { user } = useAuth();
  return user ? <ChatBox currentUser={user} /> : null;
};

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
                    <Route path="/admin/reports" element={<AdminReports />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/pets" element={<AdminPets />} />
                    <Route path="/admin/adoptions" element={<AdminAdoptions />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                    <Route path="/adopt" element={<SearchPets />} />
                    <Route path="/pet/:petId" element={<PetDetail />} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/register-pet" element={<RegisterPet />} />

                  </Routes>
                </main>
                <ChatWrapper />
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

