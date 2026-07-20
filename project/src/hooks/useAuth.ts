import { useEffect, useState } from "react";
import { getUser, signIn, signOut, type User } from "../lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
    const onChange = () => setUser(getUser());
    window.addEventListener("gch-auth-change", onChange);
    return () => window.removeEventListener("gch-auth-change", onChange);
  }, []);

  return {
    user,
    signIn: () => setUser(signIn()),
    signOut: () => {
      signOut();
      setUser(null);
    },
  };
}
