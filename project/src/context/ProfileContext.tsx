import { createContext, useContext, useState, type ReactNode } from "react";
import type { GuestProfile, Gender } from "../lib/types";
import { storage, diceBearAvatar } from "../lib/storage";

interface ProfileContextValue {
  profile: GuestProfile | null;
  createProfile: (name: string, gender: Gender) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<GuestProfile | null>(() => storage.getProfile());

  const createProfile = (name: string, gender: Gender) => {
    const newProfile: GuestProfile = {
      name: name.trim(),
      gender,
      avatar: diceBearAvatar(name.trim(), gender),
      createdAt: Date.now(),
    };
    storage.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const clearProfile = () => {
    storage.clearProfile();
    setProfile(null);
  };

  return <ProfileContext.Provider value={{ profile, createProfile, clearProfile }}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
