import { useRef, useState, useEffect } from 'react';
import MovieRow from './MovieRow';
import { RowShimmer } from './Shimmer';
import type { Movie } from '../types';

interface LazyRowProps {
  title: string;
  fetcher: () => Promise<Movie[]>;
  isOriginals?: boolean;
  onMovieClick: (movie: Movie) => void;
  onMoviePlay: (movie: Movie) => void;
  isInWatchlist: (id: number) => boolean;
  onToggleWatchlist: (movie: Movie) => void;
  rootMargin?: string;
}

export default function LazyRow({
  title,
  fetcher,
  isOriginals,
  onMovieClick,
  onMoviePlay,
  isInWatchlist,
  onToggleWatchlist,
  rootMargin = '300px',
}: LazyRowProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (!started) return;
    let active = true;
    setLoading(true);
    fetcher()
      .then((data) => { if (active) { setMovies(data); setLoading(false); } })
      .catch(() => { if (active) { setMovies([]); setLoading(false); } });
    return () => { active = false; };
  }, [started, fetcher]);

  return (
    <div ref={sentinelRef}>
      {loading ? (
        <section className="mb-10">
          <h3 className="text-lg md:text-xl font-bold text-white px-4 md:px-12 mb-3">{title}</h3>
          <RowShimmer count={10} />
        </section>
      ) : movies.length > 0 ? (
        <MovieRow
          title={title}
          movies={movies}
          loading={false}
          onMovieClick={onMovieClick}
          onMoviePlay={onMoviePlay}
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={onToggleWatchlist}
          isOriginals={isOriginals}
        />
      ) : null}
    </div>
  );
}
