import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const UserDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [myPets, setMyPets] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pets');

  useEffect(() => {
    // Redirect admin users to admin dashboard
    if (user && (user.role === 'admin' || user.is_staff)) {
      navigate('/admin-dashboard');
      return;
    }
    
    if (user && token) {
      fetchUserData();
    }
  }, [user, token, navigate]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');

    try {
      const [petsResponse, reportsResponse] = await Promise.all([
        axios.get(`${API_URL}/pets/user/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/pets/reports/user/${user.id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setMyPets(petsResponse.data);
      setMyReports(reportsResponse.data);
    } catch (err) {
      setError('Failed to load your data. Please try again.');
      console.error(err);
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
      setMyPets(myPets.filter((pet) => pet.id !== petId));
    } catch (err) {
      alert('Failed to delete pet. Please try again.');
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Manage your pet listings and reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900">My Pets</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{myPets.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900">My Reports</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{myReports.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900">Account Type</h3>
          <p className="text-xl font-semibold text-purple-600 mt-2 capitalize">{user.user_type}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/report-pet"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
          >
            Report a Pet
          </Link>
          <Link
            to="/search"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700"
          >
            Search Pets
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('pets')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'pets'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Pet Listings ({myPets.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'reports'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              My Reports ({myReports.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : activeTab === 'pets' ? (
            myPets.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>You haven't listed any pets yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myPets.map((pet) => (
                  <div key={pet.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{pet.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{pet.description}</p>
                      <div className="mt-2 flex gap-4 text-sm text-gray-500">
                        <span>Type: {pet.pet_type}</span>
                        <span>Status: {pet.status}</span>
                        <span>Location: {pet.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            myReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>You haven't submitted any reports yet.</p>
                <Link to="/report-pet" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Report a pet
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{report.pet_name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{report.description}</p>
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                          <span>Type: {report.pet_type}</span>
                          <span>Location: {report.location_found}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
