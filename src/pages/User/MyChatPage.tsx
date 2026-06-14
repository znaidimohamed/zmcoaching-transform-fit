import { MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Coach = {
  _id: string;
  fullName: string;
  email: string;
  role: "admin";
};

type ChatMessage = {
  _id: string;
  sender: {
    _id: string;
    fullName: string;
    role: "admin" | "user";
  };
  receiver: {
    _id: string;
    fullName: string;
    role: "admin" | "user";
  };
  text: string;
  createdAt: string;
};

const MyChatPage = () => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchConversation = async () => {
    try {
      const res = await api.get("/messages/me");
      setCoach(res.data.coach);
      setMessages(res.data.messages || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, []);

  const sendMessage = async () => {
    if (!text.trim() || sending) return;

    try {
      setSending(true);

      const res = await api.post("/messages/me", {
        text: text.trim(),
      });

      setMessages((prev) => [...prev, res.data.chatMessage]);
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl">
      <div className="border-b border-white/10 bg-black/40 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-900/30">
            <MessageCircle size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-black">
              {coach?.fullName || "Coach"}
            </h1>
            <p className="text-sm text-zinc-500">
              Votre coach personnel
            </p>
          </div>
        </div>
      </div>

      <div className="h-[560px] space-y-4 overflow-y-auto p-6">
        {loading ? (
          <div className="py-10 text-center text-zinc-500">
            Chargement...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-600/15 text-red-400">
                <MessageCircle size={30} />
              </div>
              <p className="font-black">Aucun message</p>
              <p className="mt-1 text-sm text-zinc-500">
                Écris à ton coach pour commencer.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender?.role === "user";

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                    isMe
                      ? "bg-red-600 text-white"
                      : "bg-white/10 text-zinc-100"
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <p
                    className={`mt-2 text-[11px] ${
                      isMe ? "text-white/60" : "text-zinc-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-white/10 bg-black/40 p-5">
        <div className="flex gap-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Écrire un message..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none focus:border-red-500"
          />

          <button
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 transition hover:bg-red-700 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyChatPage;