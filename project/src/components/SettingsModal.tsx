import { X, Lock } from "lucide-react";

interface SettingsModalProps { open: boolean; onClose: () => void; }

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-base-card border border-white/10 rounded-2xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">Settings</h2>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5">TMDB API Key</label>
            <div className="flex items-center gap-3 bg-base-hover/60 rounded-lg px-4 py-3 border border-white/5">
              <Lock className="w-4 h-4 text-brand-red shrink-0" />
              <input readOnly value="Key set & locked securely" className="bg-transparent text-sm text-white/40 font-mono tracking-wider outline-none cursor-not-allowed w-full" />
            </div>
            <p className="text-[11px] text-white/40 mt-1.5">API key is locked and runs securely behind the scenes. It cannot be viewed or edited.</p>
          </div>
          <div className="pt-2 border-t border-white/5">
            <h3 className="text-sm font-semibold mb-2">About</h3>
            <p className="text-xs text-white/50 leading-relaxed">DirectStreamHub uses the TMDB API for live movie and TV data. Streaming is powered by multiple third-party server sources. Favorites and custom movies are stored locally; comments and chat are stored in the cloud.</p>
          </div>
          <div className="text-center text-[11px] text-white/30">v1.0.0 · Built with React + Vite</div>
        </div>
      </div>
    </div>
  );
}
