import { Play, Star } from "lucide-react";
import type { MediaItem } from "../lib/types";

interface HeroProps { item: MediaItem; onWatch: (item: MediaItem) => void; onDetails: (item: MediaItem) => void; }

export default function Hero({ item, onWatch, onDetails }: HeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-base-black via-base-black/60 to-base-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-base-black/80 to-transparent" />
      </div>
      <div className="relative h-full flex flex-col justify-end pb-12 px-4 md:px-12 max-w-3xl">
        <span className="text-brand-red text-sm font-bold tracking-widest uppercase mb-2 animate-slide-up">{item.mediaType === "tv" ? "Featured Series" : "Featured Movie"}</span>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 leading-tight animate-slide-up">{item.title}</h1>
        <div className="flex items-center gap-4 mb-4 text-sm text-white/70 animate-slide-up">
          <span className="flex items-center gap-1"><Star className="w-4 h-4 text-brand-red fill-brand-red" /> {item.rating.toFixed(1)}</span>
          {item.releaseDate && <span>{item.releaseDate.slice(0, 4)}</span>}
        </div>
        <p className="text-white/70 text-sm md:text-base line-clamp-3 mb-6 max-w-2xl animate-slide-up">{item.overview}</p>
        <div className="flex gap-3 animate-slide-up">
          <button onClick={() => onWatch(item)} className="btn-brand px-6 py-3 flex items-center gap-2 text-base"><Play className="w-5 h-5 fill-white" /> Watch Now</button>
          <button onClick={() => onDetails(item)} className="btn-ghost px-6 py-3 text-base">Details</button>
        </div>
      </div>
    </section>
  );
}
