import React from 'react';

const AdminStats = ({ stats }) => {
  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <AdminStat
        title="Total Reports"
        value={stats ? stats.total_reports : '...'}
      />
      <AdminStat
        title="Pending Reviews"
        value={stats ? stats.pending_reports : '...'}
        highlight
      />
      <AdminStat
        title="Registered Users"
        value={stats ? stats.total_users : '...'}
      />
      <AdminStat
        title="Resolved Cases"
        value={stats ? `${stats.approved_pets} approved pets` : '...'}
      />
    </div>
  );
};

const AdminStat = ({ title, value, highlight }) => (
  <div
    className={`rounded-2xl p-6 shadow-lg ${
      highlight ? 'bg-red-50' : 'bg-white'
    }`}
  >
    <p className="text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminStats;


