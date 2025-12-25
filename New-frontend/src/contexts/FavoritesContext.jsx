import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites_${user.id}`);
      setFavorites(stored ? JSON.parse(stored) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `favorites_${user.id}`,
        JSON.stringify(favorites)
      );
    }
  }, [favorites, user]);

  const toggleFavorite = (pet) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === pet.id)
        ? prev.filter((p) => p.id !== pet.id)
        : [...prev, pet]
    );
  };

  const isFavorite = (id) =>
    favorites.some((pet) => pet.id === id);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
