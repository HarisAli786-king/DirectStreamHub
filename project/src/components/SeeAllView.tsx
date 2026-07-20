import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { Category, MediaItem } from "../lib/types";
import { fetchCategory } from "../lib/tmdb";
import MovieCard from "./MovieCard";

interface SeeAllViewProps {
  category: Category; customItems?: MediaItem[];
  onItemClick: (item: MediaItem) => void; onToggleFav: (item: MediaItem) => void; onBack: () => void;
}

export default function SeeAllView({ category, customItems = [], onItemClick, onToggleFav, onBack }: SeeAllViewProps) {
  const [items, setItems] = useState<MediaItem[]>(customItems);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = async (p: number) => {
    setLoading(true); setError(false);
    try {
      const { items: fetched, totalPages: tp } = await fetchCategory(category, p);
      setTotalPages(tp);
      setItems((prev) => (p === 1 ? [...customItems, ...fetched] : [...prev, ...fetched]));
    } catch { setError(true); } finally { setLoading(false); }
  };

  useEffect(() => { load(1); /* eslint-disable-next-line */ }, [category.id]);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h1 className="text-2xl md:text-3xl font-bold">{category.label}</h1>
      </div>
      {error && items.length === 0 && (
        <div className="text-center py-20 text-white/50"><p className="mb-2">Failed to load content.</p><button onClick={() => load(1)} className="btn-brand px-4 py-2 text-sm">Retry</button></div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item, i) => (<div key={`${item.id}-${i}`} className="w-full"><MovieCard item={item} onClick={onItemClick} onToggleFav={onToggleFav} compact /></div>))}
      </div>
      {loading && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-brand-red animate-spin" /></div>}
      {!loading && page < totalPages && (
        <div className="flex justify-center mt-8"><button onClick={() => { setPage(page + 1); load(page + 1); }} className="btn-ghost px-6 py-3">Load More</button></div>
      )}
    </div>
  );
}
