import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10">
      <div className="container mx-auto px-6 text-center space-y-4">
        <h3 className="text-lg font-semibold text-white">
          🐾 <span className="text-gradient">PetRescue</span>
        </h3>

        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="hover:text-emerald-400">About</a>
          <a href="#" className="hover:text-emerald-400">Contact</a>
          <a href="#" className="hover:text-emerald-400">Privacy</a>
          <a href="#" className="hover:text-emerald-400">Terms</a>
        </div>

        <p className="text-sm">
          © {new Date().getFullYear()} PetRescue. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
