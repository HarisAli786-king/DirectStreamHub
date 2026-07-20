import type { Movie } from "../types";

const STORAGE_KEY = "gch_custom_movies";

export type CustomMovieInput = {
  title: string;
  posterUrl: string;
  category: string;
  description: string;
  watchUrl: string;
};

export type CustomMovie = Movie & {
  is_custom: true;
  custom_category: string;
  custom_watch_url: string;
  added_at: number;
};

export function getCustomMovies(): CustomMovie[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addCustomMovie(input: CustomMovieInput): CustomMovie {
  const movie: CustomMovie = {
    id: Math.floor(Date.now() * Math.random()) + 1_000_000,
    title: input.title.trim(),
    overview: input.description.trim(),
    poster_path: input.posterUrl.trim() || null,
    backdrop_path: null,
    vote_average: 0,
    release_date: null,
    genre_ids: [],
    is_custom: true,
    custom_category: input.category,
    custom_watch_url: input.watchUrl.trim(),
    added_at: Date.now(),
  };
  const list = getCustomMovies();
  list.unshift(movie);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("gch-custom-change"));
  return movie;
}

export function removeCustomMovie(id: number): void {
  const list = getCustomMovies().filter((m) => m.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("gch-custom-change"));
}

export function customMoviesForCategory(categoryName: string): CustomMovie[] {
  return getCustomMovies().filter((m) => m.custom_category === categoryName);
}
