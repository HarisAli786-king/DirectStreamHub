import { Search, Plus, Settings, Film, LogOut, MessageCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";

interface HeaderProps {
  onSearch: (q: string) => void;
  onAddMovie: () => void;
  onOpenSettings: () => void;
  onNavigate: (page: "home" | "chat") => void;
  currentPage: string;
  searchActive: boolean;
  onClearSearch: () => void;
  onSignIn: () => void;
}

export default function Header({ onSearch, onAddMovie, onOpenSettings, onNavigate, currentPage, searchActive, onClearSearch, onSignIn }: HeaderProps) {
  const { profile, clearProfile } = useProfile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (searchOpen) inputRef.current?.focus(); }, [searchOpen]);
  useEffect(() => { if (!searchActive) { setQuery(""); setSearchOpen(false); } }, [searchActive]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (query.trim()) onSearch(query.trim()); };
  const closeSearch = () => { setSearchOpen(false); setQuery(""); onClearSearch(); };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-base-black/95 to-base-black/70 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center gap-3 px-4 md:px-8 h-16">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-brand-red flex items-center justify-center transition-transform group-hover:scale-110">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="hidden sm:block font-extrabold text-lg tracking-tight">Direct<span className="text-brand-red">Stream</span>Hub</span>
        </button>
        <nav className="hidden md:flex items-center gap-1 ml-4">
          <button onClick={() => onNavigate("home")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${currentPage === "home" ? "text-white bg-white/10" : "text-white/60 hover:text-white"}`}>Home</button>
          <button onClick={() => onNavigate("chat")} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${currentPage === "chat" ? "text-white bg-white/10" : "text-white/60 hover:text-white"}`}><MessageCircle className="w-4 h-4" /> Community</button>
        </nav>
        <div className="flex-1" />
        <form onSubmit={submit} className="flex items-center">
          <div className={`flex items-center overflow-hidden bg-base-card border border-white/10 rounded-full transition-all duration-300 ${searchOpen ? "w-44 sm:w-64 md:w-80" : "w-9"}`}>
            <button type="button" onClick={searchOpen ? closeSearch : () => setSearchOpen(true)} className="p-2 shrink-0"><Search className="w-4 h-4 text-white/70" /></button>
            <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search movies, series..." className={`bg-transparent outline-none text-sm text-white placeholder-white/40 transition-opacity ${searchOpen ? "opacity-100 w-full" : "opacity-0 w-0"}`} />
          </div>
        </form>
        <button onClick={onAddMovie} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors" title="Add Movie"><Plus className="w-4 h-4" /> Add</button>
        <button onClick={onOpenSettings} className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors" title="Settings"><Settings className="w-5 h-5" /></button>
        {profile ? (
          <div className="relative">
            <button onClick={() => setMenuOpen((o) => !o)} className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-brand-red/60 hover:ring-brand-red transition-all bg-base-hover">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-base-card border border-white/10 rounded-xl shadow-2xl p-2 animate-scale-in origin-top-right">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <p className="font-semibold text-sm truncate">{profile.name}</p>
                  <p className="text-xs text-white/50 capitalize">{profile.gender} · Guest</p>
                </div>
                <button onClick={() => { setMenuOpen(false); clearProfile(); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"><LogOut className="w-4 h-4" /> Clear Profile</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={onSignIn} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors" title="Create profile">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span className="hidden sm:inline">Join</span>
          </button>
        )}
      </div>
    </header>
  );
}
