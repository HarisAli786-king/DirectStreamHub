import { useEffect, useState } from "react";
import type { Category, MediaItem } from "../lib/types";
import { CATEGORIES } from "../lib/categories";
import { fetchCategory, fetchTrendingAll } from "../lib/tmdb";
import { storage } from "../lib/storage";
import Hero from "./Hero";
import AdBanner from "./AdBanner";
import CategoryRow from "./CategoryRow";
import FavoritesRow from "./FavoritesRow";

interface HomeProps {
  onItemClick: (item: MediaItem) => void; onToggleFav: (item: MediaItem) => void;
  onSeeAll: (category: Category) => void; favorites: MediaItem[]; refreshKey: number;
}

export default function Home({ onItemClick, onToggleFav, onSeeAll, favorites, refreshKey }: HomeProps) {
  const [hero, setHero] = useState<MediaItem | null>(null);
  const [rows, setRows] = useState<Record<string, { items: MediaItem[]; loading: boolean }>>({});

  useEffect(() => {
    fetchTrendingAll().then(({ items }) => { if (items.length > 0) setHero(items[Math.floor(Math.random() * Math.min(items.length, 5))]); }).catch(() => {});
  }, []);

  useEffect(() => {
    const customMovies = storage.getCustomMovies();
    CATEGORIES.forEach((cat) => {
      setRows((prev) => ({ ...prev, [cat.id]: { items: prev[cat.id]?.items || [], loading: true } }));
      const customForCat = customMovies.filter((m) => m.category === cat.id).map((m) => ({
        id: m.id, title: m.title, poster: m.poster, backdrop: m.poster, overview: m.overview,
        releaseDate: new Date(m.createdAt).toISOString().slice(0, 10), rating: 0, mediaType: cat.type,
        genreIds: [] as number[], custom: true, customWatchLink: m.watchLink, customCategory: m.category,
      }));
      fetchCategory(cat, 1)
        .then(({ items }) => setRows((prev) => ({ ...prev, [cat.id]: { items: [...customForCat, ...items], loading: false } })))
        .catch(() => setRows((prev) => ({ ...prev, [cat.id]: { items: customForCat, loading: false } })));
    });
    // eslint-disable-next-line
  }, [refreshKey]);

  return (
    <div className="pb-16">
      {hero && <Hero item={hero} onWatch={onItemClick} onDetails={onItemClick} />}
      <div className="mt-2"><AdBanner slot="below-hero" /></div>
      <div className="mt-2"><FavoritesRow items={favorites} onItemClick={onItemClick} onToggleFav={onToggleFav} /></div>
      {CATEGORIES.map((cat, idx) => {
        const row = rows[cat.id];
        if (!row) return null;
        return (
          <div key={cat.id}>
            <CategoryRow category={cat} items={row.items} loading={row.loading} onItemClick={onItemClick} onToggleFav={onToggleFav} onSeeAll={onSeeAll} />
            {(idx + 1) % 5 === 0 && <AdBanner slot={`row-${idx}`} />}
          </div>
        );
      })}
    </div>
  );
}
