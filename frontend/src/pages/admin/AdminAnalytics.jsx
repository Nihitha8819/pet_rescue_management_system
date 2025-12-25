import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminAnalytics = () => {
  const { user } = useAuth();

   const [users, setUsers] = useState([]);
   const [reports, setReports] = useState([]);
   const [pets, setPets] = useState([]);
   const [adoptions, setAdoptions] = useState([]);
   const [loading, setLoading] = useState(true);

  const isAdmin = user && (user.role === 'admin' || user.is_staff);

  /* ---------- FETCH DATA (ALWAYS RUNS) ---------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }

      try {
         const [usersRes, reportsRes, petsRes, adoptionsRes] = await Promise.all([
           api.get('/users/users/'),
           api.get('/admin/reports/'),
           api.get('/pets/'),
           api.get('/admin/adoptions/'),
         ]);

        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
        setPets(Array.isArray(petsRes.data) ? petsRes.data : []);
         setAdoptions(Array.isArray(adoptionsRes.data) ? adoptionsRes.data : []);
      } catch (err) {
        console.error('Analytics fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  /* ---------- DERIVED ANALYTICS (ALWAYS RUNS) ---------- */
   const analytics = useMemo(() => {
     const petTypes = {};
     pets.forEach(p => {
       petTypes[p.pet_type] = (petTypes[p.pet_type] || 0) + 1;
     });

     const adoptionCounts = {
       total: adoptions.length,
       pending: adoptions.filter(a => a.status === 'pending').length,
       approved: adoptions.filter(a => a.status === 'approved').length,
       rejected: adoptions.filter(a => a.status === 'rejected').length,
     };

    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.is_active).length,
      inactiveUsers: users.filter(u => !u.is_active).length,

      totalPets: pets.length,

      totalReports: reports.length,
       pendingReports: reports.filter(r => r.status === 'pending').length,
       approvedReports: reports.filter(r => r.status === 'approved').length,
       rejectedReports: reports.filter(r => r.status === 'rejected').length,

       adoptionCounts,

      petsByType: petTypes,
    };
  }, [users, reports, pets]);

  /* ---------- UI ---------- */
  if (!isAdmin) {
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
          📊 Admin Analytics
        </h1>
        <p className="text-gray-400 mt-2">
          Live platform insights derived from system data
        </p>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading analytics…</p>
      ) : (
        <>
          {/* TOP STATS */}
           <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
             <Stat label="Total Users" value={analytics.totalUsers} />
             <Stat label="Registered Pets" value={analytics.totalPets} color="cyan" />
             <Stat label="Reports" value={analytics.totalReports} />
             <Stat label="Pending Reviews" value={analytics.pendingReports} color="yellow" />
           </div>

          {/* REPORT STATUS */}
          <Section title="📄 Report Status">
            <Progress label="Approved" value={analytics.approvedReports} total={analytics.totalReports} color="green" />
            <Progress label="Pending" value={analytics.pendingReports} total={analytics.totalReports} color="yellow" />
            <Progress label="Rejected" value={analytics.rejectedReports} total={analytics.totalReports} color="red" />
          </Section>

          {/* PET TYPES */}
          <Section title="🐾 Pets by Type">
            {Object.entries(analytics.petsByType).map(([type, count]) => (
              <Progress
                key={type}
                label={type}
                value={count}
                total={analytics.totalPets}
                color="cyan"
              />
            ))}
          </Section>

          {/* USER STATUS */}
           <Section title="👥 User Activity">
             <Progress label="Active Users" value={analytics.activeUsers} total={analytics.totalUsers} color="green" />
             <Progress label="Inactive Users" value={analytics.inactiveUsers} total={analytics.totalUsers} color="red" />
           </Section>

           <Section title="🧭 Adoption Funnel">
             <Progress label="Pending" value={analytics.adoptionCounts.pending} total={analytics.adoptionCounts.total} color="yellow" />
             <Progress label="Approved" value={analytics.adoptionCounts.approved} total={analytics.adoptionCounts.total} color="green" />
             <Progress label="Rejected" value={analytics.adoptionCounts.rejected} total={analytics.adoptionCounts.total} color="red" />
           </Section>
        </>
      )}
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

const Section = ({ title, children }) => (
  <div className="max-w-7xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8">
    <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Progress = ({ label, value, total, color }) => {
  const percent = total ? Math.round((value / total) * 100) : 0;

  const colors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div>
      <div className="flex justify-between text-sm text-slate-300 mb-1">
        <span>{label}</span>
        <span>{value} ({percent}%)</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default AdminAnalytics;
