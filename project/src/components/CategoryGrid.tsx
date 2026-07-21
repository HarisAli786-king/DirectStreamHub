import { useEffect, useState } from "react";
import { ArrowLeft, Star } from "lucide-react";
import type { Movie } from "../types";
import { findCategory } from "../lib/categories";
import { customMoviesForCategory } from "../lib/customMovies";
import { imgUrl, fetchCategory } from "../lib/tmdb";

type Props = {
  categoryName: string;
  onBack: () => void;
  onSelect: (m: Movie) => void;
  customKey: number;
};

const PAGE_SIZE = 20;

export function CategoryGrid({ categoryName, onBack, onSelect, customKey }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(false);

  const category = findCategory(categoryName);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    setMovies([]);
    setPage(1);
    setTotalPages(1);

    const custom = customMoviesForCategory(categoryName);
    void customKey;

    const doFetch = async () => {
      if (!category) {
        if (!cancelled) { setMovies(custom); setLoading(false); }
        return;
      }
      try {
        const { items, totalPages: tp } = await fetchCategory(category, 1);
        if (cancelled) return;
        const mapped = items.map((it) => ({
          id: it.id,
          title: it.title,
          overview: it.overview,
          poster_path: it.poster || null,
          backdrop_path: it.backdrop || null,
          vote_average: it.rating,
          release_date: it.releaseDate || null,
          media_type: it.mediaType,
          is_tv: it.mediaType === "tv",
        })) as Movie[];
        setMovies([...custom, ...mapped]);
        setTotalPages(tp || 1);
      } catch {
        if (!cancelled) {
          if (custom.length) setMovies(custom);
          else setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName, customKey]);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages || !category) return;
    setLoadingMore(true);
    const next = page + 1;
    try {
      const { items } = await fetchCategory(category, next);
      const mapped = items.map((it) => ({
        id: it.id,
        title: it.title,
        overview: it.overview,
        poster_path: it.poster || null,
        backdrop_path: it.backdrop || null,
        vote_average: it.rating,
        release_date: it.releaseDate || null,
        media_type: it.mediaType,
        is_tv: it.mediaType === "tv",
      })) as Movie[];
      setMovies((prev) => [...prev, ...mapped]);
      setPage(next);
    } catch {
      // ignore
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="min-h-screen px-4 pt-24 pb-20 md:px-10 md:pt-28">
      <div className="mx-auto max-w-[1600px]">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>

        <h2 className="font-display text-4xl tracking-wide text-white md:text-5xl">
          {categoryName}
        </h2>
        <p className="mt-1 text-sm text-white/50">
          {loading ? "Loading…" : `${movies.length} title${movies.length !== 1 ? "s" : ""}`}
        </p>

        {loading && (
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-lg bg-base-card" />
            ))}
          </div>
        )}

        {error && !loading && (
          <p className="mt-10 text-center text-sm text-white/40">
            Unable to load {categoryName} right now.
          </p>
        )}

        {!loading && !error && movies.length === 0 && (
          <p className="mt-10 text-center text-sm text-white/40">No titles found.</p>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
              {movies.map((m) => {
                const poster = m.poster_path ? imgUrl(m.poster_path, "w342") : "";
                return (
                  <button
                    key={`${categoryName}-grid-${m.id}`}
                    onClick={() => onSelect(m)}
                    className="group overflow-hidden rounded-lg bg-base-card text-left transition hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="aspect-[2/3] w-full overflow-hidden">
                      {poster ? (
                        <img
                          src={poster}
                          alt={m.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-base-elevated p-2 text-center text-xs text-white/40">
                          {m.title}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-semibold text-white">{m.title}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-white/50">
                        {m.vote_average > 0 && (
                          <span className="flex items-center gap-0.5 text-amber-400">
                            <Star className="h-2.5 w-2.5 fill-amber-400" />
                            {m.vote_average.toFixed(1)}
                          </span>
                        )}
                        {m.release_date && <span>• {m.release_date.slice(0, 4)}</span>}
                        {m.is_tv && <span className="text-accent-red">• Series</span>}
                        {m.is_custom && <span className="text-white/70">• Custom</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {page < totalPages && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
