import { useRef } from "react";
import type { Movie } from "../types";
import { imgUrl } from "../lib/tmdb";

type Props = {
  title: string;
  movies: Movie[];
  onSelect?: (m: Movie) => void;
  onMovieClick?: (m: Movie) => void;
  onMoviePlay?: (m: Movie) => void;
  isInWatchlist?: (id: number) => boolean;
  onToggleWatchlist?: (m: Movie) => void;
  isOriginals?: boolean;
  loading?: boolean;
};

export function MovieRow({ title, movies, onSelect, onMovieClick }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const handleSelect = onSelect || onMovieClick;

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <div className="group/row">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-white/90 md:text-xl">{title}</h3>
        <div className="hidden gap-2 opacity-0 transition group-hover/row:opacity-100 md:flex">
          <button
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            ‹
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={ref}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-2 md:gap-4"
      >
        {movies.map((m) => {
          const poster = m.poster_path ? imgUrl(m.poster_path, "w342") : "";
          const year = m.release_date ? m.release_date.slice(0, 4) : "";
          return (
            <button
              key={m.id}
              onClick={() => handleSelect?.(m)}
              className="group/card relative w-[150px] flex-none overflow-hidden rounded-lg bg-ink-800 text-left transition duration-300 hover:z-10 hover:scale-105 hover:shadow-2xl md:w-[190px]"
            >
              <div className="aspect-[2/3] w-full overflow-hidden">
                {poster ? (
                  <img
                    src={poster}
                    alt={m.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-300 group-hover/card:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-ink-700 text-white/40">
                    {m.title}
                  </div>
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-3 pt-8">
                <p className="truncate text-sm font-semibold text-white">{m.title}</p>
                <p className="mt-0.5 text-xs text-white/60">
                  {year} {m.vote_average != null && m.vote_average > 0 ? `• ★ ${m.vote_average.toFixed(1)}` : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
