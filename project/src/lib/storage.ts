import type { CustomMovie, MediaItem, GuestProfile, Gender } from "./types";

const KEYS = {
  favorites: "dsh_favorites",
  custom: "dsh_custom_movies",
  profile: "dsh_guest_profile",
};

function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export const storage = {
  getFavorites(): MediaItem[] { return read<MediaItem[]>(KEYS.favorites, []); },
  toggleFavorite(item: MediaItem): MediaItem[] {
    const favs = storage.getFavorites();
    const exists = favs.some((f) => f.id === item.id);
    const next = exists ? favs.filter((f) => f.id !== item.id) : [item, ...favs];
    write(KEYS.favorites, next);
    return next;
  },
  isFavorite(id: number): boolean { return storage.getFavorites().some((f) => f.id === id); },
  getCustomMovies(): CustomMovie[] { return read<CustomMovie[]>(KEYS.custom, []); },
  addCustomMovie(movie: CustomMovie): CustomMovie[] {
    const next = [movie, ...storage.getCustomMovies()];
    write(KEYS.custom, next);
    return next;
  },
  getProfile(): GuestProfile | null { return read<GuestProfile | null>(KEYS.profile, null); },
  saveProfile(profile: GuestProfile): void { write(KEYS.profile, profile); },
  clearProfile(): void { try { localStorage.removeItem(KEYS.profile); } catch { /* ignore */ } },
};

export function diceBearAvatar(name: string, gender: Gender): string {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}
