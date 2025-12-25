import React, { useContext, useEffect, useState } from 'react';
import { MatchContext } from '../contexts/MatchContext';
import PetCard from '../components/pets/PetCard';

const Search = () => {
  const { searchPets, matchedPets } = useContext(MatchContext);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (searchTerm.trim()) {
      searchPets(searchTerm);
    }
  }, [searchTerm, searchPets]);

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Search for Pets 🐾
          </h1>
          <p className="text-gray-400 mt-2">
            Find your perfect companion by name, breed, or type
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10">
          <input
            type="text"
            placeholder="Search by name, breed, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full rounded-xl border border-gray-300 px-5 py-3
              focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              text-lg
            "
          />
        </div>

        {/* Results */}
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
          {matchedPets.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">
                Showing <span className="font-semibold">{matchedPets.length}</span> result
                {matchedPets.length !== 1 && 's'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No pets found. Try a different search 🐕
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
