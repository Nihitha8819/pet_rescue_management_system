import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminReports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  /* ---------- FETCH REPORTS ---------- */
  useEffect(() => {
    const fetchReports = async () => {
      if (!user || (user.role !== 'admin' && !user.is_staff)) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/admin/reports/');
        setReports(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to load reports', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  /* ---------- DERIVED ---------- */
  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
    found: reports.filter(r => r.status === 'found').length,
    active: reports.filter(r => r.status === 'active').length,
    inactive: reports.filter(r => r.status === 'inactive').length,
  }), [reports]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (search && !r.pet_name?.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [reports, statusFilter, search]);

  /* ---------- ACCESS GUARD ---------- */
  if (!user || (user.role !== 'admin' && !user.is_staff)) {
    return (
      <div className="pt-24 text-center text-red-500 font-semibold">
        🚫 Unauthorized
      </div>
    );
  }

  /* ---------- ACTION ---------- */
  const handleStatusChange = async (id, status) => {
    await api.put(`/admin/reports/${id}/status/`, { status });
    setReports(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6 pb-16 text-gray-200">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-white">
          🚨 Reports Moderation
        </h1>
        <p className="text-gray-400 mt-2">
          Review, verify, and moderate reported pets
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-7 gap-4 mb-10">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} color="yellow" />
        <Stat label="Approved" value={stats.approved} color="green" />
        <Stat label="Rejected" value={stats.rejected} color="red" />
        <Stat label="Found" value={stats.found} color="cyan" />
        <Stat label="Active" value={stats.active} color="emerald" />
        <Stat label="Inactive" value={stats.inactive} color="gray" />
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-8 flex flex-wrap gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="found">Found</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <input
          placeholder="Search by pet name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2 w-full md:w-72"
        />
      </div>

      {/* REPORT LIST */}
      <div className="max-w-7xl mx-auto space-y-6">
        {loading && (
          <p className="text-gray-400 text-center">Loading reports…</p>
        )}

        {!loading && filteredReports.length === 0 && (
          <p className="text-gray-400 text-center">
            No reports match your filters
          </p>
        )}

        {!loading && filteredReports.map(report => {
          const expanded = expandedId === report.id;
          const images = report.images || (report.image ? [report.image] : []);

          return (
            <div
              key={report.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900
                         border border-slate-700 rounded-2xl p-6
                         hover:shadow-[0_0_35px_rgba(56,189,248,0.25)]
                         transition-all"
            >
              {/* TOP ROW */}
              <div className="flex justify-between gap-6">

                {/* LEFT */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {report.pet_name || 'Unnamed Pet'}
                  </h3>

                  <p className="text-sm text-slate-300 mt-1">
                    {report.description || 'No description provided'}
                  </p>

                  <div className="flex gap-4 mt-3 text-xs text-slate-400">
                    <span>🐾 {report.pet_type}</span>
                    <span>📍 {report.location_found}</span>
                  </div>

                  <button
                    onClick={() => setExpandedId(expanded ? null : report.id)}
                    className="mt-3 text-cyan-400 text-sm hover:underline"
                  >
                    {expanded ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-3 min-w-[140px]">
                  <StatusBadge status={report.status} />

                  {report.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(report.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-lg"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(report.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* EXPANDED SECTION */}
              {expanded && (
                <div className="mt-6 border-t border-slate-700 pt-5 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Reporter Contact
                    </h4>
                    <p className="text-sm text-slate-300">
                      👤 {report.reporter_name || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-300">
                      📞 {report.contact_phone || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-300">
                      ✉️ {report.contact_email || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Images
                    </h4>
                    {images.length === 0 ? (
                      <p className="text-slate-400 text-sm">
                        No images provided
                      </p>
                    ) : (
                      <div className="flex gap-3 flex-wrap">
                        {images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt="pet"
                            className="w-24 h-24 object-cover rounded-lg border border-slate-600"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- UI COMPONENTS ---------- */

const Stat = ({ label, value, color }) => {
  const map = {
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400',
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    gray: 'text-gray-400',
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`text-3xl font-bold ${map[color] || 'text-white'}`}>
        {value}
      </p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    approved: 'bg-green-500/20 text-green-400 border-green-500/40',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/40',
    found: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    inactive: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border ${
        map[status] || 'bg-slate-700 text-slate-300 border-slate-600'
      }`}
    >
      {status?.toUpperCase()}
    </span>
  );
};

export default AdminReports;
