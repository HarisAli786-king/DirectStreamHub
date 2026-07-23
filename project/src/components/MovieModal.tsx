import { useEffect, useState } from "react";
import { X, Play, Heart, Star, Download, ChevronDown, Send, Loader2, Archive, Film, Tv } from "lucide-react";
import type { MediaItem, CastMember, Comment } from "../lib/types";
import { fetchDetails, fetchCredits } from "../lib/tmdb";
import { getArchiveUrl, getFilmyzillaUrl } from "../lib/streaming";
import { storage } from "../lib/storage";
import { supabase } from "../lib/supabase";
import { useProfile } from "../context/ProfileContext";

interface MovieModalProps {
  item: MediaItem | null;
  autoPlay: boolean;
  onClose: () => void;
  onToggleFav: (item: MediaItem) => void;
  onRequestSignIn: (action: string) => void;
}

export default function MovieModal({ item, autoPlay, onClose, onToggleFav, onRequestSignIn }: MovieModalProps) {
  const { profile } = useProfile();
  const [details, setDetails] = useState<Awaited<ReturnType<typeof fetchDetails>> | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [serverIdx, setServerIdx] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [posting, setPosting] = useState(false);
  const [fav, setFav] = useState(false);

  // Check if current item is Anime (safe check for genre_ids)
  const isAnime = details?.genres?.some(g => g.name.toLowerCase() === "animation") || (item as any)?.genre_ids?.includes(16);

  // 🎬 6 Standard Movie/TV Servers
  const standardServers = [
    {
      name: "Server 1 (VidSrc ME)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
          : `https://vidsrc.me/embed/movie?tmdb=${id}`
    },
    {
      name: "Server 2 (VidLink Pro)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://vidlink.pro/tv/${id}/${s}/${e}`
          : `https://vidlink.pro/movie/${id}`
    },
    {
      name: "Server 3 (2Embed Global)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`
          : `https://www.2embed.cc/embed/${id}`
    },
    {
      name: "Server 4 (Embed Su)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://embed.su/embed/tv/${id}/${s}/${e}`
          : `https://embed.su/embed/movie/${id}`
    },
    {
      name: "Server 5 (AutoEmbed)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`
          : `https://player.autoembed.cc/embed/movie/${id}`
    },
    {
      name: "Server 6 (MultiEmbed)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`
          : `https://multiembed.mov/?video_id=${id}&tmdb=1`
    }
  ];

  // 🌸 Dedicated Anime Servers (Original Anime Salt - Mega links included in their player)
  const animeServers = [
    {
      name: "Anime Server 1 (Anime Salt playX)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://animesalt.link/embed/tv?tmdb=${id}&season=${s}&episode=${e}`
          : `https://animesalt.link/embed/movie?tmdb=${id}`
    },
    {
      name: "Anime Server 2 (Anime Salt Abyss)",
      getUrl: (id: string | number, mediaType: string, s: number, e: number) =>
        mediaType === "tv"
          ? `https://animesalt.link/embed/abyss/tv/${id}/${s}/${e}`
          : `https://animesalt.link/embed/abyss/movie/${id}`
    }
  ];

  // Order: Standard Servers FIRST, Anime Servers SECOND
  const allServers = isAnime ? [...standardServers, ...animeServers] : standardServers;

  useEffect(() => {
    if (!item) return;
    setPlaying(autoPlay);
    setServerIdx(0);
    setSeason(1);
    setEpisode(1);
    setFav(storage.isFavorite(item.id));
    setComments([]);
    setLoading(true);
    setDetails(null);
    setCast([]);

    fetchDetails(item.id, item.mediaType)
      .then((d) => setDetails(d))
      .catch(() => {})
      .finally(() => setLoading(false));

    fetchCredits(item.id, item.mediaType)
      .then(setCast)
      .catch(() => {});

    supabase
      .from("comments")
      .select("id, media_id, user_name, user_avatar, text, created_at")
      .eq("media_id", item.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setComments(data as Comment[]);
      });
  }, [item, autoPlay]);

  if (!item) return null;

  const handleFav = () => {
    setFav(!fav);
    onToggleFav(item);
  };

  const submitComment = async () => {
    if (!profile) {
      onRequestSignIn("post a comment");
      return;
    }
    if (!commentText.trim()) return;
    setPosting(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        media_id: item.id,
        user_name: profile.name,
        user_avatar: profile.avatar,
        text: commentText.trim()
      })
      .select("id, media_id, user_name, user_avatar, text, created_at")
      .single();

    setPosting(false);
    if (!error && data) {
      setComments((prev) => [data as Comment, ...prev]);
      setCommentText("");
    }
  };

  const watchUrl =
    item.custom && item.customWatchLink
      ? item.customWatchLink
      : allServers[serverIdx]?.getUrl(item.id, item.mediaType, season, episode);

  const seasons = details?.seasons?.filter((s) => s.season_number > 0) || [];
  const currentSeason = seasons.find((s) => s.season_number === season);
  const episodeCount = currentSeason?.episode_count || 20;

  // 📥 Download Links (HDHub4u & Dedicated Anime Salt)
  const queryTitle = item.title;
  const dl480 = `https://new3.hdhub4u.cl/?s=${encodeURIComponent(queryTitle + " 480p")}`;
  const dl720 = `https://new3.hdhub4u.cl/?s=${encodeURIComponent(queryTitle + " 720p")}`;
  const dl1080 = `https://new3.hdhub4u.cl/?s=${encodeURIComponent(queryTitle + " 1080p")}`;
  const animeSaltDl = `https://animesalt.link/search?q=${encodeURIComponent(queryTitle)}`;

  const customFallback = item.custom && item.customWatchLink ? item.customWatchLink : null;
  const archiveUrl = customFallback || getArchiveUrl(item.title);
  const filmyzillaUrl = customFallback || getFilmyzillaUrl(item.title, item.mediaType);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-base-card rounded-2xl max-w-4xl w-full my-4 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Player Section */}
        {playing ? (
          <div className="relative w-full aspect-video bg-black">
            <iframe
              key={watchUrl}
              src={watchUrl}
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen"
              className="w-full h-full border-0"
              referrerPolicy="origin"
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-black">
            {item.backdrop && (
              <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover opacity-60" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button onClick={() => setPlaying(true)} className="btn-brand px-8 py-4 flex items-center gap-2 text-lg">
                <Play className="w-6 h-6 fill-white" /> Watch Now
              </button>
            </div>
          </div>
        )}

        {/* Server & Season Selector */}
        {playing && !(item.custom && item.customWatchLink) && (
          <div className="px-4 sm:px-6 py-3 border-b border-white/5 bg-zinc-900/50 space-y-3">
            
            {/* Standard 6 Servers Heading & Buttons (Rendered FIRST) */}
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider mb-1.5">
                Standard Servers
              </p>
              <div className="flex gap-1.5 flex-wrap">
                {standardServers.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setServerIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      serverIdx === i ? "bg-brand-red text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Anime Heading & Servers if Anime (Rendered AFTER Standard Servers) */}
            {isAnime && (
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs font-bold text-brand-red uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5" /> Anime Dedicated Servers
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {animeServers.map((s, idx) => {
                    const globalIdx = standardServers.length + idx; // Calculate correct index
                    return (
                      <button
                        key={s.name}
                        onClick={() => setServerIdx(globalIdx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          serverIdx === globalIdx ? "bg-brand-red text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TV Season / Episode selectors */}
            {item.mediaType === "tv" && (
              <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <div className="relative">
                  <select
                    value={season}
                    onChange={(e) => {
                      setSeason(Number(e.target.value));
                      setEpisode(1);
                    }}
                    className="appearance-none bg-base-hover text-white text-xs rounded-lg pl-3 pr-8 py-1.5 border border-white/10 cursor-pointer"
                  >
                    {seasons.length > 0
                      ? seasons.map((s) => (
                          <option key={s.season_number} value={s.season_number}>
                            Season {s.season_number}
                          </option>
                        ))
                      : [1, 2, 3, 4, 5].map((s) => (
                          <option key={s} value={s}>
                            Season {s}
                          </option>
                        ))}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={episode}
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="appearance-none bg-base-hover text-white text-xs rounded-lg pl-3 pr-8 py-1.5 border border-white/10 cursor-pointer"
                  >
                    {Array.from({ length: episodeCount }).map((_, i) => (
                      <option key={i} value={i + 1}>
                        Episode {i + 1}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Details Section */}
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:block w-24 shrink-0">
              {item.poster && <img src={item.poster} alt={item.title} className="w-full rounded-lg shadow-lg" />}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{details?.title || details?.name || item.title}</h2>
              {details?.tagline && <p className="text-brand-red text-sm italic mb-2">{details.tagline}</p>}
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/60 mb-3">
                {item.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-brand-red fill-brand-red" /> {item.rating.toFixed(1)}
                  </span>
                )}
                {details?.runtime ? <span>{details.runtime} min</span> : null}
                {details?.genres?.slice(0, 3).map((g) => (
                  <span key={g.id} className="px-2 py-0.5 bg-white/10 rounded text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{details?.overview || item.overview}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            {!playing && (
              <button onClick={() => setPlaying(true)} className="btn-brand px-5 py-2.5 flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" /> Watch Now
              </button>
            )}
            <button
              onClick={handleFav}
              className={`px-5 py-2.5 flex items-center gap-2 rounded-lg font-semibold transition-colors ${
                fav ? "bg-brand-red text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-white" : ""}`} /> {fav ? "Saved" : "Favorite"}
            </button>
          </div>

          {/* 📥 Download Options */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="text-sm font-bold mb-3 text-white/80 flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-red" /> Download Options
            </h3>

            {/* Anime Dedicated Download Button (Shows if Anime) */}
            {isAnime && (
              <div className="mb-3">
                <a
                  href={animeSaltDl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg bg-red-600/90 hover:bg-red-600 border border-white/10 px-4 py-3 text-sm font-bold text-white transition shadow-md"
                >
                  <span className="flex items-center gap-2">
                    <Tv className="w-4 h-4" /> Download from Anime Salt (Dedicated)
                  </span>
                  <Download className="w-4 h-4 text-white" />
                </a>
              </div>
            )}

            {/* HDHub4u Qualities for Movies / Standard Content */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <a
                href={dl480}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-4 py-3 text-sm font-bold text-blue-400 transition shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Film className="w-4 h-4" /> 480p (HDHub4u)
                </span>
                <Download className="w-4 h-4 text-white" />
              </a>

              <a
                href={dl720}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-4 py-3 text-sm font-bold text-emerald-400 transition shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Film className="w-4 h-4" /> 720p (HDHub4u)
                </span>
                <Download className="w-4 h-4 text-white" />
              </a>

              <a
                href={dl1080}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-4 py-3 text-sm font-bold text-purple-400 transition shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Film className="w-4 h-4" /> 1080p (HDHub4u)
                </span>
                <Download className="w-4 h-4 text-white" />
              </a>
            </div>

            {/* General Secondary Mirrors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={filmyzillaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-purple-600/80 hover:bg-purple-600 px-4 py-2.5 text-xs font-bold text-white transition"
              >
                <Download className="h-4 w-4" /> Filmyzilla Mirror
              </a>
              <a
                href={archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition"
              >
                <Archive className="h-4 w-4" /> Internet Archive Mirror
              </a>
            </div>
          </div>

          {/* Cast Section */}
          {cast.length > 0 && (
            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="text-sm font-bold mb-3 text-white/80">Cast & Crew</h3>
              {loading ? (
                <Loader2 className="w-5 h-5 text-brand-red animate-spin" />
              ) : (
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                  {cast.map((c) => (
                    <div key={c.id} className="shrink-0 w-20 text-center">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-base-hover mb-1.5">
                        {c.profile ? (
                          <img src={c.profile} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                            {c.name[0]}
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium truncate">{c.name}</p>
                      <p className="text-[10px] text-white/40 truncate">{c.character}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Comments Section */}
          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="text-sm font-bold mb-3 text-white/80">Comments ({comments.length})</h3>
            <div className="flex gap-2 mb-3">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                placeholder={profile ? "Write a comment..." : "Create a profile to comment"}
                className="flex-1 bg-base-hover text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-brand-red"
              />
              <button
                onClick={submitComment}
                disabled={posting}
                className="btn-brand px-4 py-2 flex items-center gap-1 disabled:opacity-50"
              >
                {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-white/40 text-sm">No comments yet. Be the first!</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="flex gap-2.5">
                    <img
                      src={c.user_avatar}
                      alt={c.user_name}
                      className="w-8 h-8 rounded-full shrink-0 bg-base-hover"
                    />
                    <div className="bg-base-hover rounded-lg px-3 py-2 flex-1">
                      <p className="text-xs font-semibold mb-0.5">{c.user_name}</p>
                      <p className="text-sm text-white/80">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
