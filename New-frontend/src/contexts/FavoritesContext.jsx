import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/apiClients";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();
export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user, loading } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await apiClient.get("/pets/favorites/");
        setFavorites(res.data.map(pet => pet.id));
      } catch (err) {
        console.error("Failed to fetch favorites", err);
        setFavorites([]);
      }
    };

    fetchFavorites();
  }, [user, loading]);

  const toggleFavorite = async (petId) => {
    if (!user) {
      alert("Please login to save favorites");
      return;
    }

    try {
      await apiClient.post("/pets/favorites/", { pet_id: petId });

      setFavorites(prev =>
        prev.includes(petId)
          ? prev.filter(id => id !== petId)
          : [...prev, petId]
      );
    } catch (err) {
      console.error("Toggle favorite failed", err);
    }
  };

  const isFavorite = (petId) => favorites.includes(petId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
