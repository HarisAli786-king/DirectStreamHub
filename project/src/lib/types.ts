export type MediaType = "movie" | "tv";

export interface MediaItem {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  overview: string;
  releaseDate: string;
  rating: number;
  mediaType: MediaType;
  genreIds: number[];
  custom?: boolean;
  customWatchLink?: string;
  customCategory?: string;
}

export interface CastMember { id: number; name: string; character: string; profile: string; }
export interface Comment { id: string; media_id: number; user_name: string; user_avatar: string; text: string; created_at: string; }
export interface ChatMessage { id: string; user_name: string; user_avatar: string; text: string; created_at: string; }
export interface CustomMovie { id: number; title: string; poster: string; overview: string; category: string; watchLink: string; createdAt: number; }
export interface Category {
  id: string; label: string; slug: string; type: MediaType;
  endpoint: "trending" | "discover" | "search" | "genre";
  query?: string; genreId?: number; withKeywords?: string; withCompanies?: string;
  withOriginalLanguage?: string; withOriginCountry?: string;
}
export interface ServerSource { name: string; getUrl: (tmdbId: number, type: MediaType, season?: number, episode?: number) => string; }

export type Gender = "male" | "female";

export interface GuestProfile {
  name: string;
  gender: Gender;
  avatar: string;
  createdAt: number;
}
