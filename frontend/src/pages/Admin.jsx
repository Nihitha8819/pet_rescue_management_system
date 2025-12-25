import React from 'react';
import AdminPanel from '../components/admin/AdminPanel';
import ManageUsers from '../components/admin/ManageUsers';

const Admin = () => {
  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fadeUp">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Admin Control Center 🛡️
          </h1>
          <p className="text-gray-400 mt-2">
            Monitor system activity, manage users, and control platform operations
          </p>
        </div>

        {/* Admin Panel */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-10 animate-fadeUp">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Platform Overview
          </h2>
          <AdminPanel />
        </div>

        {/* Manage Users */}
        <div className="bg-white rounded-3xl shadow-xl p-6 animate-fadeUp">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Management
          </h2>
          <ManageUsers />
        </div>

      </div>
    </div>
  );
};

export default Admin;
