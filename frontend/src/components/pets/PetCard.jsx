import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  const getImageUrl = () => {
    if (pet.images && Array.isArray(pet.images) && pet.images.length > 0) {
      return pet.images[0];
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={getImageUrl()}
        alt={pet.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>
            <span className="font-medium">Type:</span> {pet.pet_type}
          </p>
          {pet.breed && (
            <p>
              <span className="font-medium">Breed:</span> {pet.breed}
            </p>
          )}
          {pet.age && (
            <p>
              <span className="font-medium">Age:</span> {pet.age} years
            </p>
          )}
          <p>
            <span className="font-medium">Location:</span> {pet.location}
          </p>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{pet.description}</p>
        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              pet.status === 'available'
                ? 'bg-green-100 text-green-800'
                : pet.status === 'adopted'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {pet.status}
          </span>
          <Link
            to={`/pet/${pet.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;