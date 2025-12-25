import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState(null);

  /* ---------- FETCH DASHBOARD DATA ---------- */
  useEffect(() => {
    const fetchStats = async () => {
      if (!user || (user.role !== 'admin' && !user.is_staff)) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/admin/dashboard/');
        setStats(res.data);
        setLastSync(new Date());
      } catch (e) {
        console.error('Failed to load admin stats', e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  /* ---------- DERIVED DATA (ALWAYS RUNS) ---------- */
  const attentionRequired = useMemo(() => {
    if (!stats) return [];
    const alerts = [];
    if (stats.pending_reports > 0)
      alerts.push(`🚨 ${stats.pending_reports} reports pending review`);
    if (stats.pending_users > 0)
      alerts.push(`👥 ${stats.pending_users} users pending verification`);
    if (stats.unclosed_found_pets > 0)
      alerts.push(`🐾 ${stats.unclosed_found_pets} found pets not closed`);
    return alerts;
  }, [stats]);

  /* ---------- ACCESS GUARD (AFTER HOOKS) ---------- */
  if (!user || (user.role !== 'admin' && !user.is_staff)) {
    return (
      <div className="pt-24 text-center text-red-500 font-semibold">
        🚫 Unauthorized Access
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6 pb-16 text-gray-200">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-white flex items-center gap-2">
          🛡️ Admin Control Center
        </h1>
        <p className="text-gray-400 mt-2">
          High-level system overview & priority actions
        </p>
        {lastSync && (
          <p className="text-xs text-gray-500 mt-1">
            Last synced: {lastSync.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* ATTENTION REQUIRED */}
      {attentionRequired.length > 0 && (
        <div className="max-w-7xl mx-auto mb-10 bg-red-900/20 border border-red-500/40 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-red-400 mb-3">
            🚨 Attention Required
          </h2>
          <ul className="list-disc ml-6 space-y-1 text-sm">
            {attentionRequired.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

       {/* STATS */}
       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <StatCard label="Pending Reports" value={stats?.pending_reports} color="yellow" />
         <StatCard label="Total Users" value={stats?.total_users} color="blue" />
         <StatCard label="Approved Pets" value={stats?.approved_pets} color="green" />
         <StatCard label="Rejected Reports" value={stats?.rejected_reports} color="red" />
       </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* SYSTEM OVERVIEW */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">📊 System Overview</h3>
          <OverviewRow label="Total Reports" value={stats?.total_reports} />
          <OverviewRow label="Found Pets" value={stats?.found_pets} />
          <OverviewRow label="Lost Pets" value={stats?.lost_pets} />
          <OverviewRow label="Adoptions" value={stats?.total_adoptions} />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">⚡ Quick Actions</h3>
          <ActionButton text="Moderate Reports" to="/admin/reports" />
          <ActionButton text="Manage Users" to="/admin/users" />
          <ActionButton text="View Analytics" to="/admin/analytics" />
          <ActionButton text="Register Emergency Pet" to="/register-pet" />
        </div>

        {/* SYSTEM SIGNALS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">📈 System Signals</h3>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>• Reports trending higher this week</li>
            <li>• Dog-related cases dominate</li>
            <li>• Urban locations most active</li>
            <li className="text-xs text-gray-500 mt-2">
              (Analytics expand later)
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-14 text-xs text-gray-500">
        Dashboard metrics are aggregated snapshots for admins.
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ label, value, color }) => {
  const colors = {
    yellow: 'border-yellow-400 text-yellow-400',
    blue: 'border-cyan-400 text-cyan-400',
    green: 'border-green-400 text-green-400',
    red: 'border-red-400 text-red-400',
  };

  return (
    <div className={`rounded-2xl border p-6 bg-white/5 ${colors[color]}`}>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-3xl font-bold mt-1">
        {value ?? '—'}
      </p>
    </div>
  );
};

const OverviewRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-white/10 last:border-none">
    <span className="text-gray-400 text-sm">{label}</span>
    <span className="font-semibold">{value ?? '—'}</span>
  </div>
);

const ActionButton = ({ text, to }) => (
  <a
    href={to}
    className="block w-full text-center bg-white/10 hover:bg-white/20 transition rounded-xl py-3 mb-3 font-semibold"
  >
    {text}
  </a>
);

export default AdminDashboard;
