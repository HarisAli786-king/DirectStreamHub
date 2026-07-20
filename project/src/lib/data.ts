import { supabase, type Movie } from "./supabase";

export async function fetchFeaturedMovie(): Promise<Movie | null> {
  const { data, error } = await supabase
    .from("movies")
    .select("*, genres(*), watch_options(*)")
    .eq("is_featured", true)
    .order("rating", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Movie | null;
}

export async function fetchAllMovies(): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*, genres(*), watch_options(*)")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data as Movie[]) ?? [];
}

export function groupByGenre(movies: Movie[]): { genre: string; movies: Movie[] }[] {
  const map = new Map<string, Movie[]>();
  for (const m of movies) {
    const genres = m.genres && m.genres.length ? m.genres : [{ name: "Featured" }];
    for (const g of genres) {
      const list = map.get(g.name) ?? [];
      if (!list.some((x) => x.id === m.id)) list.push(m);
      map.set(g.name, list);
    }
  }
  return Array.from(map.entries())
    .map(([genre, list]) => ({ genre, movies: list }))
    .sort((a, b) => b.movies.length - a.movies.length);
}

export function googleSearchUrl(title: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(title + " movie watch")}`;
}
