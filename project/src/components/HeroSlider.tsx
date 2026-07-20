import { useEffect, useState } from "react";
import { Play, Info } from "lucide-react";
import type { Movie } from "../types";
import { imgUrl } from "../lib/tmdb";

type Props = {
  movies: Movie[];
  onSelect: (m: Movie) => void;
};

const SLIDE_MS = 5000;

export function HeroSlider({ movies, onSelect }: Props) {
  const [index, setIndex] = useState(0);
  const count = movies.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;
  const movie = movies[index];
  const bg = movie.backdrop_path ? imgUrl(movie.backdrop_path, "original") : "";

  return (
    <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden md:h-[85vh]">
      <div className="absolute inset-0">
        {bg ? (
          <img src={bg} alt={movie.title} className="h-full w-full object-cover animate-fadeIn" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-base-elevated via-base-black to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-black via-base-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-base-black via-base-black/50 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full items-end px-4 pb-16 md:px-10 md:pb-24">
        <div key={movie.id} className="max-w-2xl animate-fadeInUp">
          <span className="mb-3 inline-block rounded-full border border-accent-red/40 bg-accent-red/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-accent-red">
            Trending Now
          </span>
          <h2 className="font-display text-4xl leading-none tracking-wide text-white md:text-7xl">
            {movie.title}
          </h2>
          <div className="mt-3 flex items-center gap-3 text-sm text-white/70">
            {movie.vote_average > 0 && (
              <span className="text-amber-400">★ {movie.vote_average.toFixed(1)}</span>
            )}
            {movie.release_date && <span>• {movie.release_date.slice(0, 4)}</span>}
            {movie.is_tv && <span className="text-accent-red">• Series</span>}
          </div>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 line-clamp-3 md:text-base">
            {movie.overview}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => onSelect(movie)}
              className="flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Play className="h-4 w-4 fill-black" /> Play
            </button>
            <button
              onClick={() => onSelect(movie)}
              className="flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <Info className="h-4 w-4" /> More Info
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-accent-red" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
