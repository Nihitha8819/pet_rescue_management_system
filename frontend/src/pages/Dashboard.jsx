import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import DashboardHome from '../components/dashboard/DashboardHome';
import MyPets from '../components/dashboard/MyPets';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="pt-24 px-6">
        <div className="bg-yellow-50 p-4 rounded-xl text-yellow-800">
          Please log in to access your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Welcome, {user.name} 👋
          </h1>
          <p className="text-gray-400 mt-2">
            Here’s a quick overview of your activity
          </p>
        </div>

        {/* Dashboard Sections */}
        <div className="space-y-10">
          {/* Overview */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <DashboardHome />
          </div>

          {/* My Pets */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
            <MyPets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
