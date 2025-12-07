import React, { useContext, useEffect, useState } from 'react';
import { MatchContext } from '../contexts/MatchContext';
import PetCard from '../components/pets/PetCard';

const Search = () => {
    const { searchPets, matchedPets } = useContext(MatchContext);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (searchTerm) {
            searchPets(searchTerm);
        }
    }, [searchTerm, searchPets]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search for Pets</h1>
            <input
                type="text"
                placeholder="Search by name, breed, or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded w-full mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchedPets.length > 0 ? (
                    matchedPets.map((pet) => <PetCard key={pet.id} pet={pet} />)
                ) : (
                    <p>No pets found.</p>
                )}
            </div>
        </div>
    );
};

export default Search;