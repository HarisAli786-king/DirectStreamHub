export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
  genre_ids?: number[];
  media_type?: string;
  original_language?: string;
  is_tv?: boolean;
  first_air_date?: string | null;
  name?: string;
  is_custom?: boolean;
  custom_category?: string;
  custom_watch_url?: string;
};

export type AdSlotId = string;

export type Genre = { id: number; name: string };

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string | null;
  runtime: number | null;
  genres: Genre[];
  tagline: string | null;
  cast: CastMember[];
  crew?: CrewMember[];
  is_tv?: boolean;
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: { id: number; name: string; season_number: number; episode_count: number; poster_path: string | null }[];
  media_type?: string;
  status?: string;
  videos?: { results: { id: string; key: string; name: string; site: string; type: string; official: boolean }[] };
};

export type CategoryConfig = {
  name: string;
  fetcher: (page: number) => Promise<Movie[]>;
};
