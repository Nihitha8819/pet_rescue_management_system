import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./RegisterPet.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const EditPetPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    location: "",
    vaccination_status: "",
    description: "",
  });

  useEffect(() => {
    const fetchPet = async () => {
      const res = await axios.get(`${API_URL}/pets/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
    };

    fetchPet();
  }, [id, token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(`${API_URL}/pets/update/${id}/`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    navigate("/my-pets");
  };

  return (
    <div className="register-page">
      <h1>Edit Pet Listing</h1>

      <form onSubmit={handleSubmit} className="register-layout">
        <div className="register-main">
          <input name="name" value={formData.name} onChange={handleChange} />
          <input name="breed" value={formData.breed} onChange={handleChange} />
          <input name="location" value={formData.location} onChange={handleChange} />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
          <button className="submit-btn">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditPetPage;
