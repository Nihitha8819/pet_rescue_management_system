import React, { useState, useEffect } from "react";
import axios from "axios";
import PetCard from "../Components/Pets/PetCard";
import "./SearchPets.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const SearchPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    fetchPets();
  }, [filters]);

  const fetchPets = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.status) params.append("status", filters.status);

      const response = await axios.get(
        `${API_URL}/pets/all/?${params.toString()}`
      );
      let petsData = response.data;

      if (filters.search) {
        const keyword = filters.search.toLowerCase();
        petsData = petsData.filter(
          (pet) =>
            pet.name?.toLowerCase().includes(keyword) ||
            pet.description?.toLowerCase().includes(keyword) ||
            pet.location?.toLowerCase().includes(keyword)
        );
      }

      setPets(petsData);
    } catch {
      setError("Failed to load pets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const resetFilters = () => {
    setFilters({ type: "", status: "", search: "" });
  };

  return (
    <div className="sp-wrapper">
      <h1 className="sp-title">Search Pets</h1>

      <div className="sp-filter-card">
        <div className="sp-filter-grid">
          <div className="sp-filter-field">
            <label>Search</label>
            <input
              type="text"
              name="search"
              placeholder="Search by name, description, or location"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="sp-filter-field">
            <label>Pet Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="sp-filter-field">
            <label>Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="adopted">Adopted</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>

        <button className="sp-reset-btn" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {error && <div className="sp-error-box">{error}</div>}

      {loading ? (
        <div className="sp-loading">
          <div className="sp-spinner"></div>
          <p>Loading pets...</p>
        </div>
      ) : pets.length === 0 ? (
        <div className="sp-empty">
          <p>No pets found matching your criteria.</p>
          <button onClick={resetFilters}>Clear filters</button>
        </div>
      ) : (
        <div>
          <p className="sp-results-count">
            Found {pets.length} pet{pets.length !== 1 ? "s" : ""}
          </p>

          <div className="sp-grid">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPets;
