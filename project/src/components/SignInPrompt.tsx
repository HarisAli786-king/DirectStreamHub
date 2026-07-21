import { useState } from "react";
import { X, UserPlus, User } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import { diceBearAvatar } from "../lib/storage";
import type { Gender } from "../lib/types";

interface SignInPromptProps { open: boolean; onClose: () => void; action: string; }

export default function SignInPrompt({ open, onClose, action }: SignInPromptProps) {
  const { createProfile } = useProfile();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Please enter a display name"); return; }
    createProfile(name, gender);
    setName(""); setError("");
    onClose();
  };

  const previewAvatar = name.trim() ? diceBearAvatar(name.trim(), gender) : "";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative bg-base-card border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        <div className="w-16 h-16 mx-auto rounded-full bg-brand-red/20 flex items-center justify-center mb-4 overflow-hidden">
          {previewAvatar ? <img src={previewAvatar} alt="avatar preview" className="w-full h-full object-cover" /> : <UserPlus className="w-8 h-8 text-brand-red" />}
        </div>
        <h3 className="text-xl font-bold mb-1">Join the community</h3>
        <p className="text-white/60 text-sm mb-6">Create a guest profile to {action}. No account needed — just pick a name.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Display Name *</label>
            <div className="relative">
              <User className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full bg-base-hover text-white text-sm rounded-lg pl-9 pr-3 py-2.5 border border-white/10 outline-none focus:border-brand-red" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {(["male", "female"] as Gender[]).map((g) => (
                <button key={g} type="button" onClick={() => setGender(g)} className={`px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors border ${gender === g ? "bg-brand-red text-white border-brand-red" : "bg-base-hover text-white/70 border-white/10 hover:bg-white/10"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-brand-red text-xs">{error}</p>}
          <button type="submit" className="btn-brand w-full py-3">Join Community</button>
        </form>
        <button onClick={onClose} className="mt-3 text-white/40 text-sm hover:text-white/70">Maybe later</button>
      </div>
    </div>
  );
}
