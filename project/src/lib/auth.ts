const KEY = "gch_user";

export type User = {
  name: string;
  email: string;
  avatar: string;
};

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function signIn(): User {
  const user: User = {
    name: "Cinema Fan",
    email: "fan@globalcinema.hub",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CF&backgroundColor=e50914&textColor=ffffff",
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("gch-auth-change"));
  return user;
}

export function signOut(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("gch-auth-change"));
}
