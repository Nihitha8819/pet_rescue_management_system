import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import petService from '../../services/petService';

const PetDetail = () => {
    const { petId } = useParams();
    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const response = await petService.getPetById(petId);
                setPet(response.data);
            } catch (err) {
                setError('Failed to fetch pet details');
            } finally {
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold">{pet.name}</h1>
            <img src={pet.images[0]} alt={pet.name} className="w-full h-auto rounded-lg" />
            <div className="mt-4">
                <h2 className="text-xl">Details</h2>
                <p><strong>Type:</strong> {pet.type}</p>
                <p><strong>Breed:</strong> {pet.breed}</p>
                <p><strong>Age:</strong> {pet.age}</p>
                <p><strong>Gender:</strong> {pet.gender}</p>
                <p><strong>Size:</strong> {pet.size}</p>
                <p><strong>Description:</strong> {pet.description}</p>
                <p><strong>Status:</strong> {pet.status}</p>
                <p><strong>Location:</strong> {pet.location}</p>
            </div>
        </div>
    );
};

export default PetDetail;