import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import dogImg from '../assets/dog.png'; // 👈 use your earlier dog image

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="pt-16"> {/* navbar height */}
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white">
        <div className="
          container mx-auto px-6
          min-h-[85vh]
          flex flex-col md:flex-row
          items-center justify-between
          gap-10
        ">
          {/* LEFT CONTENT */}
          <div className="text-center md:text-left max-w-xl">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Welcome to <span className="text-emerald-400">PetRescue</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8">
              Connecting loving homes with pets in need
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="
                      bg-emerald-500 text-black
                      px-8 py-3 rounded-lg font-semibold
                      hover:bg-emerald-600 transition
                    "
                  >
                    Get Started
                  </Link>

                  <Link
                    to="/search"
                    className="
                      border border-white
                      px-8 py-3 rounded-lg font-semibold
                      hover:bg-white hover:text-black transition
                    "
                  >
                    Search Pets
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/search"
                    className="
                      bg-emerald-500 text-black
                      px-8 py-3 rounded-lg font-semibold
                      hover:bg-emerald-600 transition
                    "
                  >
                    Find Pets
                  </Link>

                  <Link
                    to="/report-pet"
                    className="
                      border border-white
                      px-8 py-3 rounded-lg font-semibold
                      hover:bg-white hover:text-black transition
                    "
                  >
                    Report a Pet
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="max-w-md w-full">
          <img
              src={dogImg}
              alt="Rescue dog"
              className="w-full object-contain drop-shadow-2xl animate-float"
          />

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gray-50 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature icon="🔍" title="Search for Pets" />
          <Feature icon="📝" title="Report Found Pets" />
          <Feature icon="❤️" title="Adopt & Save Lives" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Stat value="500+" label="Pets Rescued" />
          <Stat value="1000+" label="Happy Adopters" />
          <Stat value="50+" label="Partner Shelters" />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-100 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join our community and help pets find their forever homes
        </p>

        {!user && (
          <Link
            to="/signup"
            className="
              bg-emerald-500 text-black
              py-3 px-10 rounded-lg font-semibold
              hover:bg-emerald-600 transition
            "
          >
            Sign Up Now
          </Link>
        )}
      </section>
    </div>
  );
};

const Feature = ({ icon, title }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">
      Simple, secure and designed to help pets find loving homes.
    </p>
  </div>
);

const Stat = ({ value, label }) => (
  <div>
    <h3 className="text-4xl font-bold text-emerald-500 mb-2">{value}</h3>
    <p className="text-gray-600">{label}</p>
  </div>
);

export default Home;
