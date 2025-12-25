import { motion } from "framer-motion";
import { Search, Filter, Plus, Sparkles } from "lucide-react";
import { Link,useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import "./AdoptPage.css";
import { mockPets } from "../hooks/mockPets";
import PetCard from "../Components/Pets/PetCard";

const AdoptPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const adoptablePets = useMemo(
    () => mockPets.filter((pet) => pet.status === "adoptable"),
    []
  );

  const filteredPets = useMemo(() => {
    return adoptablePets.filter((pet) => {
      const matchesSearch =
        pet.name.toLowerCase().includes(search.toLowerCase()) ||
        pet.breed.toLowerCase().includes(search.toLowerCase()) ||
        pet.location.toLowerCase().includes(search.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "dogs" && pet.type === "Dog") ||
        (activeTab === "cats" && pet.type === "Cat") ||
        (activeTab === "others" && !["Dog", "Cat"].includes(pet.type));

      return matchesSearch && matchesTab;
    });
  }, [search, activeTab, adoptablePets]);

  return (
    <div className="adopt-container">
      <div className="adopt-header">
        <div className="adopt-header-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="badge"
          >
            <Sparkles size={16} /> 150+ Pets Waiting for You
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="adopt-title"
          >
            Find Your <span>Soulmate.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="adopt-subtitle"
          >
            Browse verified listings of pets looking for a forever home.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button  className="primary-btn" onClick={() => navigate("/RegisterPet")} 
      style={{ cursor: "pointer" }}>
            <Plus size={18} /> Register Pet for Adoption
          </button>
        </motion.div>
      </div>

      <div className="adopt-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            placeholder="Search by breed, color, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs">
          {["all", "dogs", "cats", "others"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"
                ? "All Pets"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="pet-grid">
        {filteredPets.map((pet) => (
          <Link key={pet.id} to={`/adopt/${pet.id}`}>
            <PetCard {...pet} />
          </Link>
        ))}
      </div>

      {filteredPets.length === 0 && (
        <div className="empty-state">
          <Search size={48} />
          <h3>No pets found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}

      <div className="subscribe-box">
        <h2>Can't find what you're looking for?</h2>
        <p>New pets are added daily. Subscribe for alerts.</p>

        <div className="subscribe-form">
          <input placeholder="Email address" />
          <button>Subscribe to Alerts</button>
        </div>
      </div>
    </div>
  );
};

export default AdoptPage;
