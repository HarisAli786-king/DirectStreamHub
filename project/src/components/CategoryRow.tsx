import { ChevronRight } from "lucide-react";
import type { MediaItem, Category } from "../lib/types";
import MovieCard from "./MovieCard";

interface CategoryRowProps {
  category: Category; items: MediaItem[]; loading: boolean;
  onItemClick: (item: MediaItem) => void; onToggleFav: (item: MediaItem) => void; onSeeAll: (category: Category) => void;
}

export default function CategoryRow({ category, items, loading, onItemClick, onToggleFav, onSeeAll }: CategoryRowProps) {
  if (!loading && items.length === 0) return null;
  return (
    <section className="px-4 md:px-8 mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2"><span className="w-1 h-5 bg-brand-red rounded-full" />{category.label}</h2>
        <button onClick={() => onSeeAll(category)} className="flex items-center gap-1 text-sm text-white/50 hover:text-brand-red transition-colors">See All <ChevronRight className="w-4 h-4" /></button>
      </div>
      {loading ? (
        <div className="flex gap-3 overflow-hidden">{Array.from({ length: 8 }).map((_, i) => (<div key={i} className="shrink-0 w-[180px] aspect-[2/3] rounded-lg bg-base-card animate-pulse" />))}</div>
      ) : (
        <div className="flex gap-3 overflow-x-auto no-scrollbar row-scroll pb-2">
          {items.map((item) => (<MovieCard key={`${item.id}-${item.mediaType}`} item={item} onClick={onItemClick} onToggleFav={onToggleFav} />))}
        </div>
      )}
    </section>
  );
}
