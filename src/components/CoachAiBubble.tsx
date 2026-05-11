import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { sendCoachAiMessage } from "@/lib/api";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

const CoachAiBubble = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Hey 👋 أنا Coach AI. اسألني على training, nutrition ولا كيفاش تبدأ.",
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessage("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const data = await sendCoachAiMessage(userMessage);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "صار مشكل صغير. عاود جرّب بعد شوية.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.92,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 25,
              scale: 0.92,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              mb-4
              w-[380px]
              max-sm:w-[calc(100vw-24px)]
              origin-bottom-right
              overflow-hidden
              rounded-3xl
              border border-white/10
              bg-zinc-950/95
              shadow-2xl
              backdrop-blur-xl
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 bg-red-600 px-4 py-3 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <Bot size={20} />
                </div>

                <div>
                  <p className="text-sm font-black">
                    ZM Coach AI
                  </p>

                  <p className="text-xs text-white/80">
                    Fitness assistant
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                className="transition hover:scale-110"
              >
                <X size={18} />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="h-[420px] space-y-3 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-zinc-100"
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                </div>
              ))}

              {loading && (
                <div className="w-fit rounded-2xl bg-white/10 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="flex gap-2 border-t border-white/10 p-3">
              <input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSend()
                }
                placeholder="اكتب سؤالك..."
                className="flex-1 rounded-full bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />

              <button
                onClick={handleSend}
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-all duration-300 hover:scale-105 hover:bg-red-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="group relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/40 transition-all duration-300 hover:scale-110"
      >
        <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />

        <MessageCircle
          size={28}
          className="relative z-10"
        />
      </button>
    </div>
  );
};

export default CoachAiBubble;