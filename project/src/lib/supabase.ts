import { createClient } from "@supabase/supabase-js";

// Fallback placeholder values taake URL missing hone par site crash na ho
const url = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieWatchOption {
  id: number;
  provider_name: string;
  url: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  trailer_url: string | null;
  tagline: string | null;
  year: number | null;
  runtime_minutes: number | null;
  rating: number | null;
  country: string | null;
  language: string | null;
  is_featured: boolean | null;
  genres: MovieGenre[];
  watch_options: MovieWatchOption[];
}
