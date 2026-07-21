import { useState } from "react";
import { X, Plus } from "lucide-react";
import { storage } from "../lib/storage";
import { CATEGORIES } from "../lib/categories";
import type { CustomMovie } from "../lib/types";

interface AddMovieModalProps { open: boolean; onClose: () => void; onAdded: () => void; onRequestSignIn: () => void; isAuthed: boolean; }

export default function AddMovieModal({ open, onClose, onAdded, onRequestSignIn, isAuthed }: AddMovieModalProps) {
  const [form, setForm] = useState({ title: "", poster: "", category: CATEGORIES[0].id, overview: "", watchLink: "" });
  const [error, setError] = useState("");
  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthed) { onRequestSignIn(); return; }
    if (!form.title.trim()) { setError("Title is required"); return; }
    const movie: CustomMovie = { id: Date.now(), title: form.title.trim(), poster: form.poster.trim(), overview: form.overview.trim(), category: form.category, watchLink: form.watchLink.trim(), createdAt: Date.now() };
    storage.addCustomMovie(movie);
    setForm({ title: "", poster: "", category: CATEGORIES[0].id, overview: "", watchLink: "" });
    setError(""); onAdded(); onClose();
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-base-card border border-white/10 rounded-2xl p-6 max-w-md w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-brand-red" /> Add Custom Movie</h2>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs font-medium text-white/60 mb-1">Title *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-base-hover text-white text-sm rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-brand-red" placeholder="Movie title" /></div>
          <div><label className="block text-xs font-medium text-white/60 mb-1">Poster Image URL</label><input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} className="w-full bg-base-hover text-white text-sm rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-brand-red" placeholder="https://image-url.jpg" /></div>
          <div><label className="block text-xs font-medium text-white/60 mb-1">Category</label><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-base-hover text-white text-sm rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-brand-red">{CATEGORIES.map((c) => (<option key={c.id} value={c.id}>{c.label}</option>))}</select></div>
          <div><label className="block text-xs font-medium text-white/60 mb-1">Description</label><textarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} rows={3} className="w-full bg-base-hover text-white text-sm rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-brand-red resize-none" placeholder="Short description" /></div>
          <div><label className="block text-xs font-medium text-white/60 mb-1">Watch Link</label><input value={form.watchLink} onChange={(e) => setForm({ ...form, watchLink: e.target.value })} className="w-full bg-base-hover text-white text-sm rounded-lg px-3 py-2.5 border border-white/10 outline-none focus:border-brand-red" placeholder="https://stream-url" /></div>
          {error && <p className="text-brand-red text-xs">{error}</p>}
          <button type="submit" className="btn-brand w-full py-3">Add Movie</button>
        </form>
      </div>
    </div>
  );
}
