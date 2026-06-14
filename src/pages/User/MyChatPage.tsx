import { Send } from "lucide-react";

const messages = [
  {
    id: 1,
    sender: "coach",
    text: "Bonjour, comment avance ta semaine ?",
  },
  {
    id: 2,
    sender: "me",
    text: "Très bien coach 💪",
  },
];

const MyChatPage = () => {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="border-b border-white/10 p-6">
        <h1 className="text-3xl font-black">
          Mohamed Znaidy
        </h1>

        <p className="text-zinc-500">
          Votre coach personnel
        </p>
      </div>

      <div className="h-[550px] overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-md rounded-3xl px-5 py-3 ${
                msg.sender === "me"
                  ? "bg-red-600"
                  : "bg-white/10"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-5">
        <div className="flex gap-3">
          <input
            placeholder="Écrire un message..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
          />

          <button className="h-14 w-14 rounded-2xl bg-red-600 flex items-center justify-center">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyChatPage;