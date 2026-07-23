import { Heart, Star, Play, Calendar } from "lucide-react";
import type { MediaItem } from "../lib/types";
import { storage } from "../lib/storage";
import { useState } from "react";

interface MovieCardProps {
  item: MediaItem;
  onClick: (item: MediaItem) => void;
  onToggleFav: (item: MediaItem) => void;
  compact?: boolean;
}

export default function MovieCard({ item, onClick, onToggleFav, compact }: MovieCardProps) {
  const [fav, setFav] = useState(() => storage.isFavorite(item.id));

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFav(!fav);
    onToggleFav(item);
  };

  // Release year nikalne ke liye
  const releaseYear = item.releaseDate ? item.releaseDate.slice(0, 4) : null;

  return (
    <div
      onClick={() => onClick(item)}
      className="group relative shrink-0 cursor-pointer card-hover"
      style={{ width: compact ? 150 : 180 }}
    >
      <div className="relative rounded-lg overflow-hidden bg-base-card aspect-[2/3] shadow-lg">
        {/* Poster Image */}
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs p-2 text-center">
            {item.title}
          </div>
        )}

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Favorite Button */}
        <button
          onClick={handleFav}
          className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all z-10 ${
            fav
              ? "bg-brand-red text-white"
              : "bg-black/50 text-white/70 opacity-0 group-hover:opacity-100"
          }`}
          title={fav ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-white" : ""}`} />
        </button>

        {/* Custom Tag */}
        {item.custom && (
          <span className="absolute top-2 left-2 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
            Custom
          </span>
        )}

        {/* Play Button Overlay */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 bg-brand-red rounded-full px-2.5 py-1 w-fit shadow-md">
            <Play className="w-3 h-3 fill-white text-white" />
            <span className="text-[10px] font-bold text-white">Play</span>
          </div>
        </div>
      </div>

      {/* Title and Metadata */}
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-brand-red transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-[11px] text-white/50 mt-0.5 flex-wrap">
          {/* Rating */}
          {item.rating > 0 && (
            <span className="flex items-center gap-0.5 font-semibold text-yellow-400">
              <Star className="w-3 h-3 text-brand-red fill-brand-red" />
              {item.rating.toFixed(1)}
            </span>
          )}

          {/* 📅 Release Date / Year */}
          {item.releaseDate && (
            <span className="flex items-center gap-0.5 text-white/70 font-medium">
              <Calendar className="w-3 h-3 text-brand-red" />
              {item.releaseDate}
            </span>
          )}

          {/* Media Type */}
          <span className="uppercase text-[9px] bg-white/10 px-1 py-0.2 rounded font-mono">
            {item.mediaType}
          </span>
        </div>
      </div>
    </div>
  );
}
