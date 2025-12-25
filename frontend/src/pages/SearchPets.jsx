import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from '../components/pets/PetCard';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';

const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SearchPets = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    type: '',
    search: '',
  });

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line
  }, [filters]);

  const fetchPets = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ IMPORTANT: NO query params here
      const response = await axios.get(`${API_URL}/pets/`);

      const data = Array.isArray(response.data) ? response.data : [];

      // ✅ FRONTEND FILTERING (SAFE)
      const filtered = data.filter((pet) => {
        if (!pet.is_approved) return false;
        if (pet.status !== 'available') return false;

        if (
          filters.type &&
          pet.pet_type?.toLowerCase() !== filters.type.toLowerCase()
        ) {
          return false;
        }

        if (filters.search) {
          const q = filters.search.toLowerCase();
          return (
            pet.name?.toLowerCase().includes(q) ||
            pet.description?.toLowerCase().includes(q) ||
            pet.location?.toLowerCase().includes(q)
          );
        }

        return true;
      });

      setPets(filtered);
    } catch (err) {
      console.error(err);
      setError('Failed to load pets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ type: '', search: '' });
  };

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Adopt a Pet 🐾
        </h1>
        <p className="text-gray-400 text-lg">
          Browse approved pets available for adoption
        </p>
      </div>

      <div className="max-w-6xl mx-auto">

        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Search
              </label>
              <input
                name="search"
                type="text"
                placeholder="Name, description, or location"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3
                           focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Pet Type
              </label>
              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white
                           focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Types</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="mt-5 text-right">
            <button
              onClick={resetFilters}
              className="text-emerald-600 hover:underline text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-300">Loading pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl">
            <p className="text-lg text-gray-600">
              No pets available for adoption right now.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-6">
              Showing <span className="font-semibold">{pets.length}</span> pet
              {pets.length !== 1 && 's'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  onAdopt={handleAdopt}
                  currentUser={user}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPets;

/* ---------- ADOPTION ---------- */
async function handleAdopt(pet) {
  try {
    await apiClient.post('/adoptions/request/', { pet_id: pet.id });
    alert('Adoption request submitted. Await admin approval.');
  } catch (e) {
    console.error('Adoption error data:', e.response?.data);
    const data = e.response?.data;
    let msg = 'Failed to submit adoption request.';

    if (data) {
      if (typeof data === 'string') {
        msg = data;
      } else if (data.detail) {
        msg = data.detail;
      } else if (data.non_field_errors) {
        msg = data.non_field_errors.join(' ');
      } else if (typeof data === 'object') {
        // Collect all field errors
        const errors = Object.values(data).flat();
        if (errors.length > 0) msg = errors.join(' ');
      }
    }
    alert(msg);
  }
}
