import { useState, useEffect, useRef } from 'react';
import { Send, Users, Circle, LogIn, Plus } from 'lucide-react';

interface ChatMessage {
  id: number;
  user: string;
  avatar: string;
  text: string;
  time: string;
  self?: boolean;
}

const AVATAR_COLORS = [
  'from-rose-500 to-red-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-sky-500 to-blue-600',
  'from-violet-500 to-purple-600',
  'from-fuchsia-500 to-pink-600',
];

const SEED_MESSAGES: ChatMessage[] = [
  { id: 1, user: 'Cinephile_92', avatar: 'from-rose-500 to-red-600', text: 'Just finished watching Dune Part Two — that sandworm ride scene was unreal in IMAX.', time: '12:41 PM', self: false },
  { id: 2, user: 'ReelTalk', avatar: 'from-sky-500 to-blue-600', text: 'Agreed! Villeneuve’s sound design is on another level. The thump during the worm sequence literally shook my seat.', time: '12:43 PM', self: false },
  { id: 3, user: 'FrameByFrame', avatar: 'from-emerald-500 to-teal-600', text: 'Hot take: the book is still better, but the movie is the best possible adaptation we could have asked for.', time: '12:45 PM', self: false },
  { id: 4, user: 'PopcornPete', avatar: 'from-amber-500 to-orange-600', text: 'Anyone else hyped for the next Monsterverse entry? Godzilla x Kong was pure dumb fun.', time: '12:48 PM', self: false },
];

const ONLINE_USERS = ['Cinephile_92', 'ReelTalk', 'FrameByFrame', 'PopcornPete', 'NightOwl', 'SilverScreen'];

function colorFor(name: string): string {
  const sum = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Community() {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleLogin = () => {
    setLoggingIn(true);
    setTimeout(() => {
      setUser('You');
      setLoggingIn(false);
    }, 900);
  };

  const handleSend = () => {
    if (!user || !input.trim()) return;
    const msg: ChatMessage = {
      id: Date.now(),
      user: 'You',
      avatar: colorFor('You'),
      text: input.trim(),
      time: nowTime(),
      self: true,
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');

    // Simulated reply
    setTimeout(() => {
      const replier = ONLINE_USERS[Math.floor(Math.random() * ONLINE_USERS.length)];
      const replies = [
        'Totally agree with you on that!',
        'Hmm, not sure I’d go that far, but I see your point.',
        'Adding that to my watchlist right now, thanks!',
        'The cinematography in that one is stunning.',
        'Have you seen the director’s earlier work? Even better imo.',
        'That soundtrack though — still stuck in my head.',
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          user: replier,
          avatar: colorFor(replier),
          text: replies[Math.floor(Math.random() * replies.length)],
          time: nowTime(),
        },
      ]);
    }, 1400 + Math.random() * 800);
  };

  return (
    <div className="pt-16 min-h-screen bg-cinema-black">
      <div className="max-w-6xl mx-auto px-4 md:px-12 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white text-glow flex items-center gap-3">
              <Users className="w-8 h-8 text-accent-red" />
              Community Hub
            </h1>
            <p className="text-white/50 text-sm mt-1">Talk movies with fellow cinephiles in real time.</p>
          </div>
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2 border border-cinema-ash/40">
            <Circle className="w-2.5 h-2.5 fill-emerald-400 text-emerald-400 animate-pulse" />
            <span className="text-sm text-white/80 font-medium">{ONLINE_USERS.length} online</span>
          </div>
        </div>

        {/* Chat card */}
        <div className="glass rounded-2xl border border-cinema-ash/30 overflow-hidden shadow-2xl shadow-black/50 flex flex-col h-[65vh] min-h-[480px]">
          {/* Online avatars strip */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-cinema-ash/20 overflow-x-auto no-scrollbar">
            {ONLINE_USERS.map((u) => (
              <div key={u} className="flex items-center gap-2 flex-shrink-0">
                <div className={`relative w-7 h-7 rounded-full bg-gradient-to-br ${colorFor(u)} flex items-center justify-center text-[10px] font-bold text-white`}>
                  {u[0]}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-cinema-coal" />
                </div>
                <span className="text-xs text-white/60 hidden md:inline">{u}</span>
              </div>
            ))}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto cinema-scroll px-4 md:px-6 py-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex items-start gap-3 ${m.self ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.avatar} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {m.user[0]}
                </div>
                <div className={`max-w-[75%] ${m.self ? 'items-end' : ''} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white/90">{m.self ? 'You' : m.user}</span>
                    <span className="text-[10px] text-white/40">{m.time}</span>
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.self
                        ? 'bg-accent-red text-white rounded-tr-sm'
                        : 'bg-cinema-graphite text-white/90 rounded-tl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input / login */}
          <div className="border-t border-cinema-ash/20 p-3 md:p-4">
            {!user ? (
              <button
                onClick={handleLogin}
                disabled={loggingIn}
                className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold py-3 rounded-xl hover:bg-white/90 transition-all disabled:opacity-60"
              >
                {loggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login with Google to join the chat
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colorFor('You')} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  Y
                </div>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message about movies..."
                  className="flex-1 bg-cinema-ink border border-cinema-ash/40 rounded-full px-4 py-2.5 text-white text-sm outline-none focus:border-accent-red transition-colors placeholder:text-cinema-fog/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-full bg-accent-red text-white flex items-center justify-center hover:bg-accent-crimson transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Room chips */}
        <div className="mt-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wider text-cinema-fog">Rooms:</span>
          {['General', 'Sci-Fi', 'Horror', 'Anime', 'Bollywood', 'Awards Season'].map((room, i) => (
            <button
              key={room}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === 0 ? 'bg-accent-red text-white' : 'glass text-white/70 hover:text-white border border-cinema-ash/30'
              }`}
            >
              {i === 0 && <Plus className="w-3 h-3 inline mr-1 -ml-1" />}
              {room}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
