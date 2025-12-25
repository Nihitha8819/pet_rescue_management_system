import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useFavorites } from "../../contexts/FavoritesContext";
import "./PetCard.css";

const PetCard = ({ id, name, type, breed, location, date, 
  image, status, variant = "adoption",}) => {
  const navigate = useNavigate();
  const isLost = status === "lost";
  const isFound = status === "found";

  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pet-card"
    >
      <div className="pet-image-wrapper">
        <img
          src={image}
          alt={name}
          className="pet-image"
        />

        <div className="pet-badges">
          <span
            className={`badge ${
              isLost ? "lost" : isFound ? "found" : "primary"
            }`}
          >
            {status || type}
          </span>

          {breed && <span className="badge secondary">{breed}</span>}
        </div>

        <button
          className={`favorite-btn ${favorite ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(id);
          }}
        >
          <Heart className={favorite ? "filled" : ""} size={18} />
        </button>
      </div>

      <div className="pet-content">
        <div className="pet-header">
          <h3>{name}</h3>

          <div className="pet-meta">
            <div>
              <MapPin size={14} />
              {location}
            </div>

            {date && (
              <div>
                <Calendar size={14} />
                {date}
              </div>
            )}
          </div>
        </div>

        <button className="pet-action-btn" onClick={() => navigate("/PetDetail")}>
          {variant === "adoption" ? "View Details" : "Contact Finder"}
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default PetCard;
