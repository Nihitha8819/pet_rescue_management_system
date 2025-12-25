import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminUsers = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI STATE
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  /* ---------- FETCH USERS ---------- */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || (user.role !== 'admin' && !user.is_staff)) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/users/users/');
        setUsers(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error('Failed to load users', e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  /* ---------- TOGGLE ACTIVE ---------- */
  const handleToggleActive = async (targetUser) => {
    try {
      const newStatus = !targetUser.is_active;
      await api.put(`/admin/users/${targetUser.id}/status/`, {
        is_active: newStatus,
      });
      setUsers(prev =>
        prev.map(u =>
          u.id === targetUser.id ? { ...u, is_active: newStatus } : u
        )
      );
    } catch (e) {
      console.error('Failed to update user status', e);
    }
  };

  /* ---------- DERIVED DATA ---------- */
  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    admins: users.filter(u => u.role === 'admin' || u.is_staff).length,
  }), [users]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (search && !u.name?.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (roleFilter !== 'all' && u.role !== roleFilter)
        return false;
      return true;
    });
  }, [users, search, roleFilter]);

  /* ---------- ACCESS GUARD ---------- */
  if (!user || (user.role !== 'admin' && !user.is_staff)) {
    return (
      <div className="pt-24 text-center text-red-500 font-semibold">
        🚫 Unauthorized Access
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6 pb-16">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold text-white">
          👥 User Management
        </h1>
        <p className="text-gray-400 mt-2">
          Manage users, roles and access control
        </p>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Total Users" value={stats.total} />
        <Stat label="Active" value={stats.active} color="green" />
        <Stat label="Inactive" value={stats.inactive} color="red" />
        <Stat label="Admins" value={stats.admins} color="cyan" />
      </div>

      {/* FILTER BAR */}
      <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-5 mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by user name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2 w-full md:w-72"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* USERS LIST */}
      <div className="max-w-7xl mx-auto space-y-5">

        {loading && (
          <p className="text-gray-400 text-center py-10">
            Loading users…
          </p>
        )}

        {!loading && filteredUsers.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No users found.
          </p>
        )}

        {!loading && filteredUsers.map(u => (
          <div
            key={u.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900
                       border border-slate-700 rounded-2xl p-6
                       hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]
                       transition-all"
          >
            <div className="flex flex-col md:flex-row justify-between gap-6">

              {/* LEFT */}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {u.name}
                </h3>
                <p className="text-sm text-slate-400">{u.email}</p>

                <div className="flex gap-3 mt-3 text-xs">
                  <Badge
                    text={u.role.toUpperCase()}
                    color={u.role === 'admin' ? 'cyan' : 'gray'}
                  />
                  <Badge
                    text={u.is_active ? 'ACTIVE' : 'INACTIVE'}
                    color={u.is_active ? 'green' : 'red'}
                  />
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleActive(u)}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition
                    ${
                      u.is_active
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {u.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------- SMALL UI ---------- */

const Stat = ({ label, value, color }) => {
  const map = {
    green: 'text-green-400',
    red: 'text-red-400',
    cyan: 'text-cyan-400',
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
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    gray: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
  };

  return (
    <span
      className={`px-3 py-1 text-xs rounded-full border ${map[color]}`}
    >
      {text}
    </span>
  );
};

export default AdminUsers;
