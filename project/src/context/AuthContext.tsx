import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { AppUser } from "../lib/types";
import { supabase } from "../lib/supabase";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapUser(session: { user?: { id: string; email?: string; user_metadata?: Record<string, unknown> } } | null): AppUser | null {
  const u = session?.user;
  if (!u) return null;
  const meta = u.user_metadata || {};
  return {
    id: u.id,
    email: u.email || "",
    name: (meta.full_name as string) || (meta.name as string) || u.email || "User",
    avatar: (meta.avatar_url as string) || (meta.picture as string) || "https://i.pravatar.cc/100?img=68",
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(mapUser(data.session)); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => { setUser(mapUser(session)); })();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  };
  const signOut = async () => { await supabase.auth.signOut(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
