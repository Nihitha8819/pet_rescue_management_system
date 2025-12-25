import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import PetCard from "../Components/Pets/PetCard";
import "./LostFound.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const LostFoundPage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveReports = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/pets/reports/active/`
        );
        setReports(res.data);
      } catch (err) {
        console.error("Failed to load active reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveReports();
  }, []);

  const filteredPets = useMemo(() => {
    return reports.filter((pet) => {
      const matchesSearch =
        `${pet.pet_name} ${pet.pet_type} ${pet.location_found}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "lost" && pet.report_type === "lost") ||
        (activeTab === "found" && pet.report_type === "found");

      return matchesSearch && matchesTab;
    });
  }, [search, activeTab, reports]);

  return (
    <div className="lf-container">
      <div className="lf-header">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lf-title"
          >
            Lost &amp; Found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lf-subtitle"
          >
            Help us reunite pets with their loving families.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            className="lf-primary-btn"
            onClick={() => navigate("/ReportPet")}
          >
            <Plus size={18} /> Report Lost / Found Pet
          </button>
        </motion.div>
      </div>

      <div className="lf-search-row">
        <div className="lf-search-box">
          <Search size={18} />
          <input
            placeholder="Search by location, breed, or pet type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="tabs">
          {["all", "lost", "found"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "all"
                ? "All"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="lf-grid">
        {!loading &&
          filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              id={pet.id}
              name={pet.pet_name || "Unknown"}
              type={pet.pet_type}
              breed={pet.breed}
              location={pet.location_found}
              date={pet.created_at}
              image={pet.images?.[0]}
              status={pet.report_type}
              variant="lost-found"
            />
          ))}
      </div>

      {!loading && filteredPets.length === 0 && (
        <div className="lf-empty">
          <Search size={48} />
          <h3>No reports found</h3>
          <p>Try adjusting your filters or search terms.</p>
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

export default LostFoundPage;
