import { Search, Settings, Bell, Bookmark, X, Menu, Users } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Genre } from '../types';

type Page = 'home' | 'community';

interface NavbarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  onGenreSelect: (genreId: number | null) => void;
  selectedGenre: number | null;
  genres: Genre[];
  onOpenSettings: () => void;
  onOpenWatchlist: () => void;
  onOpenAddMovie: () => void;
  watchlistCount: number;
  hasApiKey: boolean;
  page: Page;
  onNavigate: (page: Page) => void;
}

export default function Navbar({
  onSearch,
  searchQuery,
  onGenreSelect,
  selectedGenre,
  genres,
  onOpenSettings,
  onOpenWatchlist,
  onOpenAddMovie,
  watchlistCount,
  hasApiKey,
  page,
  onNavigate,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) setGenreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass shadow-2xl shadow-black/50' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="px-4 md:px-12 h-16 flex items-center gap-4 md:gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
          <h1 className="font-display text-2xl md:text-3xl tracking-wider text-accent-red text-glow leading-none">
            GLOBAL CINEMA
          </h1>
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.3em] text-cinema-fog mt-1">Hub</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors font-medium ${page === 'home' ? 'text-accent-red' : 'text-white/90 hover:text-accent-red'}`}
          >Home</button>
          <button
            onClick={() => onNavigate('community')}
            className={`transition-colors font-medium flex items-center gap-1.5 ${page === 'community' ? 'text-accent-red' : 'text-white/90 hover:text-accent-red'}`}
          >
            <Users className="w-4 h-4" /> Community
          </button>
          <div ref={genreRef} className="relative">
            <button
              onClick={() => setGenreOpen(!genreOpen)}
              className="text-white/90 hover:text-accent-red transition-colors font-medium flex items-center gap-1"
            >
              Genres
            </button>
            {genreOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 max-h-80 overflow-y-auto cinema-scroll glass rounded-xl border border-cinema-ash/50 py-2 animate-scaleIn">
                <button
                  onClick={() => { onGenreSelect(null); setGenreOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-red/20 transition-colors ${
                    selectedGenre === null ? 'text-accent-red font-semibold' : 'text-white/80'
                  }`}
                >
                  All Genres
                </button>
                {genres.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { onGenreSelect(g.id); setGenreOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent-red/20 transition-colors ${
                      selectedGenre === g.id ? 'text-accent-red font-semibold' : 'text-white/80'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => onNavigate('home')} className="text-white/90 hover:text-accent-red transition-colors font-medium">New & Popular</button>
          <button onClick={onOpenWatchlist} className="text-white/90 hover:text-accent-red transition-colors font-medium">My List</button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Search */}
          <div className="flex items-center">
            {searchOpen ? (
              <div className="flex items-center glass rounded-full border border-cinema-ash/50 px-3 h-10 animate-scaleIn">
                <Search className="w-4 h-4 text-cinema-fog flex-shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Titles, people, genres..."
                  className="bg-transparent text-white text-sm px-2 py-1 w-40 md:w-64 outline-none placeholder:text-cinema-fog/60"
                />
                <button onClick={() => { onSearch(''); setSearchOpen(false); }}>
                  <X className="w-4 h-4 text-cinema-fog hover:text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full hover:bg-cinema-graphite/60 transition-colors"
              >
                <Search className="w-5 h-5 text-white/90" />
              </button>
            )}
          </div>

          {/* Watchlist */}
          <button
            onClick={onOpenWatchlist}
            className="relative p-2 rounded-full hover:bg-cinema-graphite/60 transition-colors"
          >
            <Bookmark className="w-5 h-5 text-white/90" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-accent-red text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Bell */}
          <button className="hidden md:block p-2 rounded-full hover:bg-cinema-graphite/60 transition-colors">
            <Bell className="w-5 h-5 text-white/90" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-cinema-graphite/60 transition-colors relative"
          >
            <Settings className="w-5 h-5 text-white/90" />
            {!hasApiKey && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-neon rounded-full animate-pulse" />
            )}
          </button>

          {/* Avatar — click to add your own movie */}
          <button
            onClick={onOpenAddMovie}
            title="Add your own movie"
            className="w-8 h-8 rounded-md bg-gradient-to-br from-accent-red to-accent-crimson flex items-center justify-center text-sm font-bold flex-shrink-0 hover:scale-110 hover:shadow-lg hover:shadow-accent-red/40 transition-all"
          >
            G
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden glass border-t border-cinema-ash/30 animate-slideUp">
          <div className="px-4 py-4 space-y-3">
            <button onClick={() => onNavigate('home')} className="block w-full text-left text-white/90 hover:text-accent-red py-2 font-medium">Home</button>
            <button onClick={() => onNavigate('community')} className="block w-full text-left text-white/90 hover:text-accent-red py-2 font-medium">Community</button>
            <div className="py-2">
              <p className="text-xs uppercase tracking-wider text-cinema-fog mb-2">Genres</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onGenreSelect(null)}
                  className={`px-3 py-1 rounded-full text-xs ${
                    selectedGenre === null ? 'bg-accent-red text-white' : 'bg-cinema-graphite text-white/70'
                  }`}
                >
                  All
                </button>
                {genres.slice(0, 8).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onGenreSelect(g.id)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      selectedGenre === g.id ? 'bg-accent-red text-white' : 'bg-cinema-graphite text-white/70'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => onNavigate('home')} className="block w-full text-left text-white/90 hover:text-accent-red py-2 font-medium">New & Popular</button>
            <button onClick={onOpenWatchlist} className="block w-full text-left text-white/90 hover:text-accent-red py-2 font-medium">My List</button>
          </div>
        </div>
      )}
    </nav>
  );
}
