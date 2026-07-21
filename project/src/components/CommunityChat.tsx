import { useEffect, useRef, useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useProfile } from "../context/ProfileContext";
import type { ChatMessage } from "../lib/types";

interface CommunityChatProps { onRequestSignIn: (action: string) => void; }

export default function CommunityChat({ onRequestSignIn }: CommunityChatProps) {
  const { profile } = useProfile();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("chat_messages").select("id, user_name, user_avatar, text, created_at").order("created_at", { ascending: true }).limit(200)
      .then(({ data, error }) => { if (!error && data) setMessages(data as ChatMessage[]); setLoading(false); });
  }, []);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!profile) { onRequestSignIn("send a message in the community chat"); return; }
    if (!text.trim()) return;
    setSending(true);
    const { data, error } = await supabase.from("chat_messages").insert({ user_name: profile.name, user_avatar: profile.avatar, text: text.trim() })
      .select("id, user_name, user_avatar, text, created_at").single();
    setSending(false);
    if (!error && data) { setMessages((prev) => [...prev, data as ChatMessage]); setText(""); }
  };

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 pb-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1 flex items-center gap-2"><span className="w-1 h-6 bg-brand-red rounded-full" /> Community Chat</h1>
        <p className="text-white/50 text-sm mb-4">Discuss films, share recommendations, and connect with other movie enthusiasts.</p>
        <div className="bg-base-card border border-white/10 rounded-2xl flex flex-col h-[60vh]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-brand-red animate-spin" /></div> :
              messages.map((m) => (
                <div key={m.id} className="flex gap-2.5">
                  <img src={m.user_avatar} alt={m.user_name} className="w-9 h-9 rounded-full shrink-0 bg-base-hover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5"><span className="text-sm font-semibold">{m.user_name}</span><span className="text-[10px] text-white/30">{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div>
                    <div className="bg-base-hover rounded-lg px-3 py-2 inline-block max-w-full"><p className="text-sm text-white/80 break-words">{m.text}</p></div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="p-3 border-t border-white/5 flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder={profile ? "Type a message..." : "Create a profile to chat"} className="flex-1 bg-base-hover text-white text-sm rounded-full px-4 py-2.5 border border-white/10 outline-none focus:border-brand-red" />
            <button onClick={send} disabled={sending} className="btn-brand rounded-full w-10 h-10 flex items-center justify-center shrink-0 disabled:opacity-50">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
