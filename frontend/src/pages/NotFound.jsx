import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">

        {/* 404 */}
        <h1 className="text-[120px] font-extrabold text-emerald-500 leading-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-400 mt-3">
          Oops! The page you are looking for doesn’t exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-emerald-500 text-black px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition"
          >
            Go Home
          </Link>

          <Link
            to="/search"
            className="border border-gray-300 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-black transition"
          >
            Search Pets
          </Link>
        </div>

        {/* Small hint */}
        <p className="text-gray-500 text-sm mt-10">
          🐾 PetRescue — helping pets find loving homes
        </p>
      </div>
    </div>
  );
};

export default NotFound;
