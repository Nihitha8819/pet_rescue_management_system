import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet, onAdopt, currentUser }) => {
  const isOwner = currentUser && pet.created_by?.id === currentUser.id;
  const isPending = pet.status === 'pending';
  const isAvailable = pet.status === 'available';

  const getImageUrl = () => {
    if (pet.images && Array.isArray(pet.images) && pet.images.length > 0) {
      const img = pet.images[0];
      if (img.startsWith('http')) return img;
      // Remove /api from API_URL to get base URL if needed, or just hardcode for now or use env
      const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:8000';
      return `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`;
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={getImageUrl()}
        alt={pet.name}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
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
        <div className="space-y-2 text-xs text-gray-600">
          <p>
            <span className="font-medium">Contact:</span>{' '}
            {pet.created_by?.email || 'N/A'}
            {pet.created_by?.phone ? ` • ${pet.created_by.phone}` : ''}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${pet.status === 'available'
              ? 'bg-green-100 text-green-800'
              : pet.status === 'adopted'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-yellow-100 text-yellow-800'
              }`}
          >
            {pet.status}
          </span>
          <div className="flex gap-2 items-center">
            <Link
              to={`/pet/${pet.id}`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              Details
            </Link>

            {isOwner ? (
              <span className="text-gray-400 text-xs italic font-medium">Your Pet</span>
            ) : isAvailable && onAdopt ? (
              <button
                onClick={() => onAdopt(pet)}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-semibold text-xs transition-colors"
              >
                Adopt
              </button>
            ) : isPending ? (
              <span className="text-yellow-600 text-xs font-semibold">Pending</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetCard;