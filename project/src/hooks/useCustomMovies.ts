import { useEffect, useState } from "react";
import { getCustomMovies, type CustomMovie } from "../lib/customMovies";

export function useCustomMovies() {
  const [customMovies, setCustomMovies] = useState<CustomMovie[]>([]);

  useEffect(() => {
    setCustomMovies(getCustomMovies());
    const onChange = () => setCustomMovies(getCustomMovies());
    window.addEventListener("gch-custom-change", onChange);
    return () => window.removeEventListener("gch-custom-change", onChange);
  }, []);

  return customMovies;
}
