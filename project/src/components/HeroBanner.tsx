import { useState, useEffect } from 'react';
import { Play, Info, Star, Volume2 } from 'lucide-react';
import type { Movie } from '../types';
import { BACKDROP_URL } from '../api/tmdb';

interface HeroBannerProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

const SLIDE_INTERVAL = 5000;

export default function HeroBanner({ movies, onPlay, onMoreInfo }: HeroBannerProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = movies.slice(0, 6);
  const current = slides[index];

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  if (!current) return null;

  const title = current.title || current.name || 'Untitled';
  const year = (current.release_date || current.first_air_date || '').slice(0, 4);

  return (
    <div
      className="relative h-[85vh] min-h-[600px] w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides — stacked for crossfade */}
      {slides.map((m, i) => {
        const b = BACKDROP_URL(m.backdrop_path, 'original');
        const active = i === index;
        return (
          <div
            key={m.id}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              active ? 'opacity-100' : 'opacity-0'
            } ${active ? 'animate-kenburns' : ''}`}
            style={{
              backgroundImage: b ? `url(${b})` : 'linear-gradient(135deg, #1a1a1a, #0a0a0a)',
            }}
          />
        );
      })}

      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 hero-gradient-left" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-24 md:pb-32 px-4 md:px-12">
        <div key={current.id} className="max-w-2xl animate-slideUp">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 bg-accent-red/90 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
              <Volume2 className="w-3 h-3" /> Trending Now
            </span>
            {year && <span className="text-white/70 text-sm font-medium">{year}</span>}
            <span className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-white">{current.vote_average?.toFixed(1)}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-white text-glow mb-4">
            {title}
          </h2>

          {/* Overview */}
          <p className="text-white/80 text-base md:text-lg leading-relaxed mb-8 line-clamp-3 max-w-xl">
            {current.overview}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onPlay(current)}
              className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Play className="w-5 h-5 fill-black" />
              Play
            </button>
            <button
              onClick={() => onMoreInfo(current)}
              className="flex items-center gap-2 glass text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-cinema-fog/40 transition-all border border-white/20"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Maturity rating */}
      <div className="absolute bottom-24 md:bottom-32 right-0 glass border-l-4 border-white/80 px-4 py-1 hidden md:block">
        <span className="text-white text-sm font-medium">TV-MA</span>
      </div>

      {/* Slider indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-8 bg-accent-red' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
