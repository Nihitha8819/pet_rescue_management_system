import React, { useContext, useEffect } from 'react';
import PetCard from './PetCard';
import { PetContext } from '../../contexts/PetContext';

const PetList = () => {
    const { pets, fetchPets } = useContext(PetContext);

    useEffect(() => {
        fetchPets();
    }, [fetchPets]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.length > 0 ? (
                pets.map(pet => <PetCard key={pet.id} pet={pet} />)
            ) : (
                <p className="col-span-full text-center">No pets available for adoption at the moment.</p>
            )}
        </div>
    );
};

export default PetList;