const PREFIX = "gch_comments_";

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  created_at: number;
};

function avatarFor(name: string): string {
  const seed = encodeURIComponent(name.slice(0, 2).toUpperCase() || "AN");
  return `https://api.dicebear.com/7.x/initials/svg?seed=${seed}&backgroundColor=1a1a1a&textColor=ffffff`;
}

const SEED_AUTHORS = ["ReelRanger", "PopcornPablo", "FrameFanatic", "CineSage", "MatineeMia"];

function seedComments(movieId: number): Comment[] {
  const seeds = [
    "This one surprised me — the pacing was way better than I expected.",
    "Underrated. The cinematography alone is worth the watch.",
    "Watched it twice already. The score is incredible.",
  ];
  return seeds.slice(0, 2 + (movieId % 2)).map((text, i) => ({
    id: `seed-${movieId}-${i}`,
    author: SEED_AUTHORS[(movieId + i) % SEED_AUTHORS.length],
    avatar: avatarFor(SEED_AUTHORS[(movieId + i) % SEED_AUTHORS.length]),
    text,
    created_at: Date.now() - (i + 1) * 3600_000,
  }));
}

export function getComments(movieId: number): Comment[] {
  try {
    const raw = localStorage.getItem(PREFIX + movieId);
    if (raw) return JSON.parse(raw) as Comment[];
  } catch {
    // ignore
  }
  const seeded = seedComments(movieId);
  saveComments(movieId, seeded);
  return seeded;
}

function saveComments(movieId: number, comments: Comment[]): void {
  try {
    localStorage.setItem(PREFIX + movieId, JSON.stringify(comments));
  } catch {
    // ignore
  }
}

export function addComment(movieId: number, author: string, text: string): Comment[] {
  const list = getComments(movieId);
  const comment: Comment = {
    id: `c-${Date.now()}`,
    author: author || "You",
    avatar: avatarFor(author || "You"),
    text: text.trim(),
    created_at: Date.now(),
  };
  const updated = [comment, ...list];
  saveComments(movieId, updated);
  return updated;
}
