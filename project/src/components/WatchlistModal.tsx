import { X, Trash2, Play, Bookmark } from 'lucide-react';
import type { Movie } from '../types';
import { BACKDROP_URL } from '../api/tmdb';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Movie[];
  onMovieClick: (movie: Movie) => void;
  onMoviePlay: (movie: Movie) => void;
  onRemove: (id: number) => void;
}

export default function WatchlistModal({
  isOpen,
  onClose,
  watchlist,
  onMovieClick,
  onMoviePlay,
  onRemove,
}: WatchlistModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] overflow-y-auto cinema-scroll bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div className="max-w-5xl mx-auto my-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-accent-red fill-accent-red" />
            My List
            <span className="text-sm font-normal text-white/40">({watchlist.length})</span>
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-accent-red hover:border-accent-red transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Bookmark className="w-16 h-16 text-cinema-fog mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">Your list is empty</h3>
            <p className="text-white/50 text-sm max-w-sm">
              Browse and add movies & shows to your watchlist. They'll be saved here for easy access.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {watchlist.map((movie) => {
              const title = movie.title || movie.name || 'Untitled';
              const backdrop = BACKDROP_URL(movie.backdrop_path, 'w780');
              return (
                <div
                  key={movie.id}
                  className="group relative rounded-xl overflow-hidden bg-cinema-graphite cursor-pointer transition-all hover:scale-[1.03] hover:shadow-xl"
                  onClick={() => onMovieClick(movie)}
                >
                  <div className="aspect-video w-full">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: backdrop
                          ? `url(${backdrop})`
                          : 'linear-gradient(135deg, #2a2a2a, #1a1a1a)',
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h4 className="text-white text-sm font-semibold line-clamp-1 mb-1">{title}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onMoviePlay(movie); }}
                        className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-accent-red transition-colors"
                      >
                        <Play className="w-4 h-4 text-black fill-black" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
                        className="w-8 h-8 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-accent-red hover:border-accent-red transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
