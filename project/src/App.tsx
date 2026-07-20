import { useEffect, useState, useCallback } from "react";
import { ProfileProvider, useProfile } from "./context/ProfileContext";
import Header from "./components/Header";
import Home from "./components/Home";
import SeeAllView from "./components/SeeAllView";
import SearchResults from "./components/SearchResults";
import MovieModal from "./components/MovieModal";
import AddMovieModal from "./components/AddMovieModal";
import SettingsModal from "./components/SettingsModal";
import SignInPrompt from "./components/SignInPrompt";
import CommunityChat from "./components/CommunityChat";
import AdBanner from "./components/AdBanner";
import type { Category, MediaItem } from "./lib/types";
import { storage } from "./lib/storage";
import { searchMulti } from "./lib/tmdb";

type Page = "home" | "chat" | "seeall" | "search";

function AppInner() {
  const { profile } = useProfile();
  const [page, setPage] = useState<Page>("home");
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchItems, setSearchItems] = useState<MediaItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [modalItem, setModalItem] = useState<MediaItem | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [signInAction, setSignInAction] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { setFavorites(storage.getFavorites()); }, []);
  const refreshFavorites = useCallback(() => { setFavorites(storage.getFavorites()); }, []);

  const handleItemClick = (item: MediaItem) => { setAutoPlay(false); setModalItem(item); };
  const handleToggleFav = (item: MediaItem) => { storage.toggleFavorite(item); refreshFavorites(); };
  const handleSearch = (q: string) => { setSearchQuery(q); setPage("search"); setSearchLoading(true); searchMulti(q, 1).then(({ items }) => setSearchItems(items)).catch(() => setSearchItems([])).finally(() => setSearchLoading(false)); };
  const clearSearch = () => { setSearchQuery(""); setSearchItems([]); if (page === "search") setPage("home"); };
  const handleSeeAll = (cat: Category) => { setCurrentCategory(cat); setPage("seeall"); };
  const navigate = (p: "home" | "chat") => { setPage(p); if (p === "home") clearSearch(); };
  const requestSignIn = (action: string) => { setSignInAction(action); setAddOpen(false); };
  const handleAddMovie = () => { if (!profile) setSignInAction("add a movie"); else setAddOpen(true); };
  const openSignIn = () => setSignInAction("join the community");

  return (
    <div className="min-h-screen bg-base-black text-white">
      <Header onSearch={handleSearch} onAddMovie={handleAddMovie} onOpenSettings={() => setSettingsOpen(true)} onNavigate={navigate} currentPage={page === "search" ? "home" : page} searchActive={page === "search"} onClearSearch={clearSearch} onSignIn={openSignIn} />
      <main>
        {page === "home" && <Home onItemClick={handleItemClick} onToggleFav={handleToggleFav} onSeeAll={handleSeeAll} favorites={favorites} refreshKey={refreshKey} />}
        {page === "seeall" && currentCategory && <SeeAllView category={currentCategory} onItemClick={handleItemClick} onToggleFav={handleToggleFav} onBack={() => { setPage("home"); setCurrentCategory(null); }} />}
        {page === "search" && <SearchResults query={searchQuery} items={searchItems} loading={searchLoading} onItemClick={handleItemClick} onToggleFav={handleToggleFav} />}
        {page === "chat" && <CommunityChat onRequestSignIn={requestSignIn} />}
      </main>
      <footer className="border-t border-white/5 mt-12 py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <AdBanner slot="footer" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2"><div className="w-7 h-7 rounded bg-brand-red flex items-center justify-center text-white font-bold text-sm">D</div><span className="font-bold">DirectStreamHub</span></div>
            <p className="text-xs text-white/40 text-center">Powered by TMDB · Streaming via third-party servers · For educational use only</p>
          </div>
        </div>
      </footer>
      <MovieModal item={modalItem} autoPlay={autoPlay} onClose={() => setModalItem(null)} onToggleFav={handleToggleFav} onRequestSignIn={requestSignIn} />
      <AddMovieModal open={addOpen} onClose={() => setAddOpen(false)} onAdded={() => setRefreshKey((k) => k + 1)} onRequestSignIn={() => setSignInAction("add a movie")} isAuthed={!!profile} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <SignInPrompt open={!!signInAction} onClose={() => setSignInAction(null)} action={signInAction || "continue"} />
    </div>
  );
}

export default function App() {
  return (<ProfileProvider><AppInner /></ProfileProvider>);
}
