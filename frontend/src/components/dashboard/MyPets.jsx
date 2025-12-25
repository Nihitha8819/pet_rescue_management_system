import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { petService } from '../../services/petService';

const MyPets = () => {
    const { user } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const data = await petService.getPetsByUser(user.id);
                setPets(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, [user.id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="my-pets">
            <h2 className="text-2xl font-bold mb-4">My Pets</h2>
            {pets.length === 0 ? (
                <p>No pets found.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pets.map(pet => (
                        <li key={pet.id} className="border rounded-lg p-4">
                            <h3 className="font-semibold">{pet.name}</h3>
                            <p>Type: {pet.pet_type}</p>
                            <p>Breed: {pet.breed}</p>
                            <p>Age: {pet.age}</p>
                            <p>Status: {pet.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPets;