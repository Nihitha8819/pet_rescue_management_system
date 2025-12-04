import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    <Link to="/">PetRescue</Link>
                </h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link to="/" className="hover:underline">Home</Link>
                        </li>
                        <li>
                            <Link to="/search" className="hover:underline">Search Pets</Link>
                        </li>
                        <li>
                            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/admin" className="hover:underline">Admin</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;