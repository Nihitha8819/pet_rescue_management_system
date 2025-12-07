import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PetCard from '../components/pets/PetCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const SearchPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: '',
  });

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      fetchPets();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const fetchPets = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = `${API_URL}/pets/reports/${queryString ? '?' + queryString : ''}`;
      
      console.log('Fetching pet reports from:', url);
      const response = await axios.get(url);
      console.log('Pet reports received:', response.data);
      setPets(response.data);
    } catch (err) {
      console.error('Error fetching pet reports:', err);
      setError('Failed to load pets. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const resetFilters = () => {
    setFilters({
      type: '',
      status: '',
      search: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Search Pets</h1>

      {/* Filters */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, description, or location"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Pet Type
            </label>
            <select
              id="type"
              name="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="found">Found</option>
              <option value="adopted">Adopted</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={resetFilters}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading pets...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-600 text-lg">No pets found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters to see all pets
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Found {pets.length} pet{pets.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPets;
