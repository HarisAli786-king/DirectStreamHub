import { Loader2, SearchX } from "lucide-react";
import type { MediaItem } from "../lib/types";
import MovieCard from "./MovieCard";

interface SearchResultsProps {
  query: string; items: MediaItem[]; loading: boolean;
  onItemClick: (item: MediaItem) => void; onToggleFav: (item: MediaItem) => void;
}

export default function SearchResults({ query, items, loading, onItemClick, onToggleFav }: SearchResultsProps) {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 md:px-8">
      <h1 className="text-xl md:text-2xl font-bold mb-1">Search results for <span className="text-brand-red">"{query}"</span></h1>
      <p className="text-white/50 text-sm mb-6">{items.length} results found</p>
      {loading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-red animate-spin" /></div> :
        items.length === 0 ? <div className="text-center py-20 text-white/50"><SearchX className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>No results found. Try a different search term.</p></div> :
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item, i) => (<div key={`${item.id}-${i}`} className="w-full"><MovieCard item={item} onClick={onItemClick} onToggleFav={onToggleFav} compact /></div>))}
        </div>}
    </div>
  );
}
