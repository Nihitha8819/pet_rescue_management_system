import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to PetRescue</h1>
          <p className="text-xl mb-8">Connecting loving homes with pets in need</p>
          <div className="flex justify-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
                <Link
                  to="/search"
                  className="bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Search Pets
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/search"
                  className="bg-white text-blue-600 py-3 px-8 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Find Pets
                </Link>
                <Link
                  to="/report-pet"
                  className="bg-blue-700 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Report a Pet
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-3">Search for Pets</h3>
            <p className="text-gray-600">
              Browse through our database of pets looking for homes. Filter by type, location, and more.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-3">Report Found Pets</h3>
            <p className="text-gray-600">
              Found a lost pet? Report it to help reunite them with their owners.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-5xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold mb-3">Adopt & Save Lives</h3>
            <p className="text-gray-600">
              Give a loving home to a pet in need. Make a difference in their life.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">500+</h3>
              <p className="text-gray-600">Pets Rescued</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">1000+</h3>
              <p className="text-gray-600">Happy Adopters</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold text-blue-600 mb-2">50+</h3>
              <p className="text-gray-600">Partner Shelters</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Join our community and help pets find their forever homes
        </p>
        {!user && (
          <Link
            to="/signup"
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Sign Up Now
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;