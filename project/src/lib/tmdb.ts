import type { Category, MediaItem } from "./types";
import { TMDB_API_KEY } from "./apiKey";

const TMDB_BASE = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function tmdbImage(path: string | null | undefined, size: "w200" | "w300" | "w500" | "w780" | "original" = "w500"): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

function buildUrl(path: string, params: Record<string, string | number | undefined> = {}): string {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  return url.toString();
}

export async function tmdbFetch<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const res = await fetch(buildUrl(path, params));
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json() as Promise<T>;
}

interface TmdbMovie {
  id: number; title?: string; name?: string; poster_path: string | null; backdrop_path: string | null;
  overview: string; release_date?: string; first_air_date?: string; vote_average: number;
  genre_ids?: number[]; media_type?: string;
}
interface TmdbResponse<T> { page: number; results: T[]; total_pages: number; total_results: number; }

function normalize(item: TmdbMovie, type: "movie" | "tv"): MediaItem {
  return {
    id: item.id, title: item.title || item.name || "Untitled",
    poster: tmdbImage(item.poster_path, "w500"), backdrop: tmdbImage(item.backdrop_path, "w780"),
    overview: item.overview || "", releaseDate: item.release_date || item.first_air_date || "",
    rating: item.vote_average || 0, mediaType: type, genreIds: item.genre_ids || [],
  };
}

export async function fetchCategory(category: Category, page = 1): Promise<{ items: MediaItem[]; totalPages: number }> {
  let data: TmdbResponse<TmdbMovie>;
  const type = category.type;
  if (category.endpoint === "trending") {
    data = await tmdbFetch<TmdbResponse<TmdbMovie>>(`/trending/${type}/week`, { page });
  } else if (category.endpoint === "genre") {
    data = await tmdbFetch<TmdbResponse<TmdbMovie>>(`/discover/${type}`, { page, sort_by: "popularity.desc", with_genres: category.genreId });
  } else if (category.endpoint === "discover") {
    data = await tmdbFetch<TmdbResponse<TmdbMovie>>(`/discover/${type}`, {
      page, sort_by: "popularity.desc",
      with_keywords: category.withKeywords,
      with_companies: category.withCompanies,
      with_original_language: category.withOriginalLanguage,
      with_origin_country: category.withOriginCountry,
    });
  } else {
    data = await tmdbFetch<TmdbResponse<TmdbMovie>>(`/search/${type}`, { page, query: category.query || "" });
  }
  const items = data.results.filter((r) => r.poster_path || r.backdrop_path).map((r) => normalize(r, type));
  return { items, totalPages: Math.min(data.total_pages, 500) };
}

export async function fetchTrendingAll(): Promise<{ items: MediaItem[]; totalPages: number }> {
  const data = await tmdbFetch<TmdbResponse<TmdbMovie>>("/trending/all/week", { page: 1 });
  const items = data.results.filter((r) => r.backdrop_path).map((r) => normalize(r, (r.media_type as "movie" | "tv") || "movie"));
  return { items, totalPages: 1 };
}

export async function fetchDetails(id: number, type: "movie" | "tv") {
  return tmdbFetch<{
    id: number; title?: string; name?: string; overview: string; backdrop_path: string | null; poster_path: string | null;
    runtime?: number; episode_run_time?: number[]; genres: { id: number; name: string }[];
    seasons?: { season_number: number; name: string; episode_count: number; poster_path: string }[];
    number_of_seasons?: number; vote_average: number; release_date?: string; first_air_date?: string; tagline?: string;
  }>(`/${type}/${id}`);
}

export async function fetchCredits(id: number, type: "movie" | "tv") {
  const data = await tmdbFetch<{ cast: { id: number; name: string; character: string; profile_path: string | null }[] }>(`/${type}/${id}/credits`);
  return data.cast.slice(0, 20).map((c) => ({ id: c.id, name: c.name, character: c.character, profile: tmdbImage(c.profile_path, "w200") }));
}

export async function searchMulti(query: string, page = 1) {
  const data = await tmdbFetch<TmdbResponse<TmdbMovie>>("/search/multi", { page, query });
  const items = data.results.filter((r) => (r.media_type === "movie" || r.media_type === "tv") && (r.poster_path || r.backdrop_path)).map((r) => normalize(r, r.media_type as "movie" | "tv"));
  return { items, totalPages: Math.min(data.total_pages, 500) };
}
