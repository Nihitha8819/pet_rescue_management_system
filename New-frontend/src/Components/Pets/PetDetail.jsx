import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import petService from "../../services/petService";
import "./PetDetail.css";

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
        setError("Failed to fetch pet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  if (loading) return <div className="pd-loading">Loading...</div>;
  if (error) return <div className="pd-error">{error}</div>;
  if (!pet) return <div className="pd-error">Pet not found.</div>;

  const imageUrl =
    pet.images && pet.images.length > 0
      ? pet.images[0]
      : "https://via.placeholder.com/600x400?text=No+Image";

  return (
    <div className="pd-wrapper">
      <div className="pd-card">
        <h1 className="pd-title">{pet.name}</h1>

        <img src={imageUrl} alt={pet.name} className="pd-image" />

        <div className="pd-details">
          <h2 className="pd-subtitle">Details</h2>

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
    </div>
  );
};

export default PetDetail;
