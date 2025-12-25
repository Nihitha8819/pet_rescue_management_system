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
                const data = await petService.getPetById(petId);
                setPet(data);
            } catch (err) {
                setError('Failed to fetch pet details');
            } finally {
                setLoading(false);
            }
        };

        fetchPetDetails();
    }, [petId]);

    if (loading) {
        return (
            <div className="pt-24 text-center text-gray-400">
                Loading pet details…
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-24 text-center text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-4 pb-16">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* IMAGE */}
                {pet.images && pet.images.length > 0 && (
                    <img
                        src={pet.images[0]}
                        alt={pet.name}
                        className="w-full h-80 object-cover"
                    />
                )}

                {/* CONTENT */}
                <div className="p-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <h1 className="text-3xl font-extrabold text-gray-800">
                            {pet.name}
                        </h1>

                        <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold ${pet.status === 'available'
                                    ? 'bg-green-100 text-green-700'
                                    : pet.status === 'adopted'
                                        ? 'bg-gray-200 text-gray-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                        >
                            {pet.status}
                        </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div className="space-y-2">
                            <p><strong>Type:</strong> {pet.pet_type}</p>
                            <p><strong>Breed:</strong> {pet.breed}</p>
                            <p><strong>Age:</strong> {pet.age}</p>
                            <p><strong>Gender:</strong> {pet.gender}</p>
                            <p><strong>Size:</strong> {pet.size}</p>
                        </div>

                        <div className="space-y-2">
                            <p><strong>Location:</strong> {pet.location}</p>
                            <p><strong>Description:</strong></p>
                            <p className="text-gray-600 leading-relaxed">
                                {pet.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetail;
