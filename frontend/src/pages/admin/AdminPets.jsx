import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminPets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      if (!user || (user.role !== 'admin' && !user.is_staff)) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/admin/pets/');
        setPets(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to load pets', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, [user]);

  const stats = useMemo(() => ({
    total: pets.length,
    pending: pets.filter(p => p.is_approved === false).length,
    approved: pets.filter(p => p.is_approved === true).length,
    rejected: pets.filter(p => p.is_approved === false && p.status === 'rejected').length,
  }), [pets]);

  const filteredPets = useMemo(() => {
    return pets.filter(p => {
      if (statusFilter === 'pending' && p.is_approved !== false) return false;
      if (statusFilter === 'approved' && p.is_approved !== true) return false;
      if (statusFilter === 'rejected' && p.status !== 'rejected') return false;
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [pets, statusFilter, search]);

  const handleStatusChange = async (pet, approve) => {
    try {
      const payload = approve
        ? { status: 'available', is_approved: true }
        : { status: 'rejected', is_approved: false };
      await api.put(`/admin/pets/${pet.id}/status/`, payload);
      setPets(prev =>
        prev.map(p =>
          p.id === pet.id ? { ...p, status: payload.status, is_approved: payload.is_approved } : p
        )
      );
    } catch (e) {
      console.error('Failed to update pet status', e);
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
          🐾 Pet Approvals
        </h1>
        <p className="text-gray-400 mt-2">
          Review and moderate registered pets.
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
        <input
          placeholder="Search by pet name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2 w-full md:w-72"
        />
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {loading && (
          <p className="text-gray-400 text-center">Loading pets…</p>
        )}
        {!loading && filteredPets.length === 0 && (
          <p className="text-gray-400 text-center">No pets match your filters.</p>
        )}
        {!loading && filteredPets.map(pet => (
          <div
            key={pet.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{pet.name}</h3>
                <p className="text-sm text-slate-300">
                  {pet.pet_type} • {pet.breed}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Owner: {pet.created_by?.name || pet.created_by?.email || 'Unknown'}
                </p>
                <div className="flex gap-2 mt-3 text-xs">
                  <Badge text={pet.status} color={pet.status === 'available' ? 'green' : 'gray'} />
                  <Badge text={pet.is_approved ? 'APPROVED' : 'PENDING'} color={pet.is_approved ? 'green' : 'yellow'} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                {pet.is_approved === false && (
                  <>
                    <button
                      onClick={() => handleStatusChange(pet, true)}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(pet, false)}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
                    >
                      Reject
                    </button>
                  </>
                )}
                {pet.is_approved === true && (
                  <span className="text-green-400 text-sm font-semibold">Approved</span>
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

export default AdminPets;


