import { useState, useEffect, useCallback } from 'react';
import type { Movie } from '../types';

const STORAGE_KEY = 'gch_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWatchlist(JSON.parse(stored));
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((items: Movie[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, []);

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const next = [...prev, movie];
      persist(next);
      return next;
    });
  }, [persist]);

  const removeFromWatchlist = useCallback((id: number) => {
    setWatchlist((prev) => {
      const next = prev.filter((m) => m.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const toggleWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
      persist(next);
      return next;
    });
  }, [persist]);

  const isInWatchlist = useCallback((id: number) => watchlist.some((m) => m.id === id), [watchlist]);

  return { watchlist, loaded, addToWatchlist, removeFromWatchlist, toggleWatchlist, isInWatchlist };
}
