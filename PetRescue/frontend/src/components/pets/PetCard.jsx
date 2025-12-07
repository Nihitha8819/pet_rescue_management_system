import React from 'react';
import { Link } from 'react-router-dom';

const PetCard = ({ pet }) => {
  // Handle both Pet and PetReport data structures
  const petName = pet.name || pet.pet_name || 'Unknown';
  const petLocation = pet.location || pet.location_found || 'Unknown';
  
  const getImageUrl = () => {
    if (pet.images && Array.isArray(pet.images) && pet.images.length > 0) {
      const firstImage = pet.images[0];
      // Handle both full URLs and relative paths
      if (firstImage.startsWith('http')) {
        return firstImage;
      }
      // For media files, construct the full URL
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      return `${API_URL}${firstImage}`;
    }
    return 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'adopted':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'found':
        return 'bg-blue-100 text-blue-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative overflow-hidden h-56">
        <img
          src={getImageUrl()}
          alt={petName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
          }}
        />
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md ${getStatusColor(pet.status)}`}
          >
            {pet.status ? pet.status.charAt(0).toUpperCase() + pet.status.slice(1) : 'Unknown'}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 text-gray-800 truncate">{petName}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/>
            </svg>
            <span className="font-medium">Type:</span>
            <span className="ml-1 capitalize">{pet.pet_type}</span>
          </div>
          
          {pet.breed && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Breed:</span>
              <span className="ml-1 truncate">{pet.breed}</span>
            </div>
          )}
          
          {pet.age && (
            <div className="flex items-center text-sm text-gray-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Age:</span>
              <span className="ml-1">{pet.age} {pet.age === 1 ? 'year' : 'years'}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
            <span className="font-medium">Location:</span>
            <span className="ml-1 truncate">{petLocation}</span>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2 min-h-[40px]">{pet.description}</p>
        
        <Link
          to={`/pet-report/${pet.id || pet._id}`}
          className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PetCard;