import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PetCard from '../components/pets/PetCard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const AvailablePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/pets/`);
        const data = Array.isArray(res.data) ? res.data : [];
        const filtered = data.filter(
          (pet) => pet.is_approved && pet.status === 'available'
        );
        setPets(filtered);
      } catch (e) {
        setError('Failed to load pets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Available for Adoption 🐾
        </h1>
        <p className="text-gray-400 text-lg">
          Only approved pets currently open for adoption.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-8 rounded-xl bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-500"></div>
            <p className="mt-4 text-gray-300">Loading pets...</p>
          </div>
        ) : pets.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl">
            <p className="text-lg text-gray-600">
              No approved pets available right now.
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
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AvailablePets;


