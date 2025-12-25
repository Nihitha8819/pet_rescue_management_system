import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminAdoptions = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchAdoptions = async () => {
      if (!user || (user.role !== 'admin' && !user.is_staff)) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/admin/adoptions/');
        setRequests(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to load adoptions', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAdoptions();
  }, [user]);

  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  }), [requests]);

  const filtered = useMemo(() => {
    return requests.filter(r => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [requests, statusFilter]);

  const handleStatusChange = async (reqId, newStatus) => {
    try {
      await api.put(`/adoptions/${reqId}/status/`, { status: newStatus });
      setRequests(prev =>
        prev.map(r => (r.id === reqId ? { ...r, status: newStatus } : r))
      );
    } catch (e) {
      console.error('Failed to update adoption status', e);
    }
  };

  if (!user || (user.role !== 'admin' && !user.is_staff)) {
    return (
      <div className="pt-24 text-center text-red-500 font-semibold">
        🚫 Unauthorized
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6 pb-16 text-gray-200">
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-white">
          📝 Adoption Requests
        </h1>
        <p className="text-gray-400 mt-2">
          Review and approve or reject adoption requests.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} color="yellow" />
        <Stat label="Approved" value={stats.approved} color="green" />
        <Stat label="Rejected" value={stats.rejected} color="red" />
      </div>

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
        </select>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {loading && (
          <p className="text-gray-400 text-center">Loading requests…</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="text-gray-400 text-center">No requests found.</p>
        )}
        {!loading && filtered.map(req => (
          <div
            key={req.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {req.pet?.name || 'Pet'}
                </h3>
                <p className="text-sm text-slate-300">
                  Requester: {req.petitioner?.name || req.petitioner?.email || 'Unknown'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Message: {req.message || 'No message'}
                </p>
                <div className="flex gap-2 mt-3 text-xs">
                  <Badge text={req.status} color={
                    req.status === 'approved' ? 'green'
                      : req.status === 'pending' ? 'yellow'
                      : 'red'
                  } />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(req.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, 'rejected')}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}
                {req.status !== 'pending' && (
                  <span className="text-sm font-semibold text-slate-300">
                    {req.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Stat = ({ label, value, color }) => {
  const map = {
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    red: 'text-red-400',
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

const Badge = ({ text, color }) => {
  const map = {
    green: 'bg-green-500/20 text-green-400 border-green-500/40',
    red: 'bg-red-500/20 text-red-400 border-red-500/40',
    yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    gray: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };
  return (
    <span className={`px-3 py-1 text-xs rounded-full border ${map[color] || map.gray}`}>
      {text?.toUpperCase()}
    </span>
  );
};

export default AdminAdoptions;


