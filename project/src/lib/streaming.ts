import type { ServerSource } from "./types";

export const SERVERS: ServerSource[] = [
  {
    name: "Server 1",
    getUrl: (id, type, season, episode) =>
      type === "movie"
        ? `https://vidsrc.me/embed/movie?tmdb=${id}`
        : `https://vidsrc.me/embed/tv?tmdb=${id}&season=${season || 1}&episode=${episode || 1}`,
  },
  {
    name: "Server 2",
    getUrl: (id, type, season, episode) =>
      type === "movie"
        ? `https://autoembed.to/movie/tmdb/${id}`
        : `https://autoembed.to/tv/tmdb/${id}-${season || 1}-${episode || 1}`,
  },
  {
    name: "Server 3",
    getUrl: (id, type, season, episode) =>
      type === "movie"
        ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`
        : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season || 1}&e=${episode || 1}`,
  },
  {
    name: "Server 4",
    getUrl: (id, type, season, episode) =>
      type === "movie"
        ? `https://vidsrc.to/embed/movie/${id}`
        : `https://vidsrc.to/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
];

export function getGoogleSearchUrl(title: string, type: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} ${type === "movie" ? "movie" : "series"} watch online free`)}`;
}

export function getHdHub4uUrl(title: string, type: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} ${type === "movie" ? "movie" : "series"} download hdhub4u`)}`;
}

export function getArchiveUrl(title: string): string {
  return `https://archive.org/search?query=${encodeURIComponent(`${title} movies`)}`;
}

export function getFilmyzillaUrl(title: string, type: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(`${title} ${type === "movie" ? "movie" : "series"} download filmyzilla`)}`;
}
