import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const [myPets, setMyPets] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pets');

  useEffect(() => {
    if (user && token) fetchUserData();
    // eslint-disable-next-line
  }, [user, token]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    try {
      const [petsRes, reportsRes] = await Promise.all([
        axios.get(`${API_URL}/pets/user/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/pets/reports/user/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMyPets(petsRes.data);
      setMyReports(reportsRes.data);
    } catch {
      setError('Failed to load your data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;

    try {
      await axios.delete(`${API_URL}/pets/delete/${petId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPets(myPets.filter((p) => p.id !== petId));
    } catch {
      alert('Failed to delete pet.');
    }
  };

  if (!user) {
    return (
      <div className="pt-24 px-6">
        <div className="bg-yellow-50 rounded-xl p-4 text-yellow-800">
          Please log in to view your dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-400 mt-2">
          Manage your pets, reports, and activity
        </p>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard title="My Pets" value={myPets.length} icon="🐶" />
          <StatCard title="My Reports" value={myReports.length} icon="📝" />
          <StatCard title="Account Type" value={user.user_type} icon="👤" />
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/report-pet"
              className="bg-emerald-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
            >
              Report a Pet
            </Link>
            <Link
              to="/search"
              className="border border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Search Pets
            </Link>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex border-b">
            <Tab active={activeTab === 'pets'} onClick={() => setActiveTab('pets')}>
              My Pets ({myPets.length})
            </Tab>
            <Tab active={activeTab === 'reports'} onClick={() => setActiveTab('reports')}>
              My Reports ({myReports.length})
            </Tab>
          </div>

          <div className="p-6">
            {loading ? (
              <Loader />
            ) : error ? (
              <Error message={error} />
            ) : activeTab === 'pets' ? (
              myPets.length === 0 ? (
                <Empty message="You haven’t listed any pets yet." />
              ) : (
                myPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="border border-gray-200 rounded-xl p-4 mb-4 flex justify-between gap-4 hover:shadow-lg transition"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{pet.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {pet.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {pet.pet_type} • {pet.status} • {pet.location}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePet(pet.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )
            ) : myReports.length === 0 ? (
              <Empty message="You haven’t submitted any reports yet." />
            ) : (
              myReports.map((report) => (
                <div
                  key={report.id}
                  className="border border-gray-200 rounded-xl p-4 mb-4"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{report.pet_name}</h3>
                      <p className="text-sm text-gray-600">
                        {report.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {report.pet_type} • {report.location_found}
                      </p>
                    </div>
                    <StatusBadge status={report.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- SMALL UI PARTS ---------- */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-3xl shadow-lg p-6 hover:-translate-y-1 transition">
    <div className="text-3xl">{icon}</div>
    <p className="text-gray-600 mt-2">{title}</p>
    <p className="text-3xl font-bold text-emerald-500 mt-1">{value}</p>
  </div>
);

const Tab = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-4 text-sm font-semibold transition ${
      active
        ? 'border-b-2 border-emerald-500 text-emerald-600'
        : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {children}
  </button>
);

const StatusBadge = ({ status }) => {
  const map = {
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
};

const Loader = () => (
  <div className="text-center py-12">
    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-500"></div>
  </div>
);

const Error = ({ message }) => (
  <div className="bg-red-50 p-4 rounded-xl text-red-700">{message}</div>
);

const Empty = ({ message }) => (
  <div className="text-center py-12 text-gray-500">{message}</div>
);

export default UserDashboard;
