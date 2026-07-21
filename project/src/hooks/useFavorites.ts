import { useEffect, useState } from "react";
import { getFavorites, type FavoriteMovie } from "../lib/favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    const onChange = () => setFavorites(getFavorites());
    window.addEventListener("gch-favorites-change", onChange);
    return () => window.removeEventListener("gch-favorites-change", onChange);
  }, []);

  return favorites;
}
