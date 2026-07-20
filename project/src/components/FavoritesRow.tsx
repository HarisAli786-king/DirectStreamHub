import { Heart } from "lucide-react";
import type { MediaItem } from "../lib/types";
import MovieCard from "./MovieCard";

interface FavoritesRowProps { items: MediaItem[]; onItemClick: (item: MediaItem) => void; onToggleFav: (item: MediaItem) => void; }

export default function FavoritesRow({ items, onItemClick, onToggleFav }: FavoritesRowProps) {
  if (items.length === 0) return null;
  return (
    <section className="px-4 md:px-8 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-brand-red fill-brand-red" /> My Favorites</h2>
        <span className="text-sm text-white/40">{items.length} saved</span>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar row-scroll pb-2">
        {items.map((item) => (<MovieCard key={`fav-${item.id}`} item={item} onClick={onItemClick} onToggleFav={onToggleFav} />))}
      </div>
    </section>
  );
}
