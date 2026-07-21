import type { Movie } from "../types";

const KEY = "gch_favorites";

export type FavoriteMovie = Movie & { added_at: number };

export function getFavorites(): FavoriteMovie[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: number): boolean {
  return getFavorites().some((m) => m.id === id);
}

export function toggleFavorite(movie: Movie): boolean {
  const list = getFavorites();
  const idx = list.findIndex((m) => m.id === movie.id);
  let nowFavorite: boolean;
  if (idx >= 0) {
    list.splice(idx, 1);
    nowFavorite = false;
  } else {
    list.unshift({ ...movie, added_at: Date.now() });
    nowFavorite = true;
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("gch-favorites-change"));
  return nowFavorite;
}
