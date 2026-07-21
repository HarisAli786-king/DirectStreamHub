import { useEffect } from "react";
import type { Movie, MovieGenre } from "../lib/supabase";

type Props = {
  movie: Movie;
  onClose: () => void;
  watchUrl: string;
};

export function DetailModal({ movie, onClose, watchUrl }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const bg = movie.backdrop_url ?? movie.poster_url ?? "";
  const genres = movie.genres?.map((g: MovieGenre) => g.name).join(" • ") ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in md:items-center"
      onClick={onClose}
    >
      <div
        className="relative my-8 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-56 w-full overflow-hidden md:h-72">
          {bg ? (
            <img src={bg} alt={movie.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-ink-700 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/80 transition hover:bg-black/90 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="-mt-12 px-6 pb-8 md:px-8">
          <h2 className="font-display text-4xl tracking-wide text-white md:text-5xl">{movie.title}</h2>
          {movie.tagline && <p className="mt-1 text-white/70">{movie.tagline}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/70">
            {movie.year && <span>{movie.year}</span>}
            {movie.runtime_minutes && <span>• {movie.runtime_minutes} min</span>}
            {movie.rating != null && (
              <span className="text-amber-400">★ {Number(movie.rating).toFixed(1)}</span>
            )}
            {movie.country && <span>• {movie.country}</span>}
            {movie.language && <span>• {movie.language}</span>}
          </div>

          {genres && (
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">{genres}</p>
          )}

          {movie.overview && (
            <p className="mt-5 text-sm leading-relaxed text-white/80 md:text-base">{movie.overview}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Watch — Google Search
            </a>
            {movie.trailer_url && (
              <a
                href={movie.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Trailer
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
