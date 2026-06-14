import { Search, Send } from "lucide-react";
import { useState } from "react";

const clients = [
  {
    id: 1,
    name: "Ahmed Ben Ali",
    avatar: "A",
    online: true,
  },
  {
    id: 2,
    name: "Mohamed Trabelsi",
    avatar: "M",
    online: false,
  },
  {
    id: 3,
    name: "Youssef",
    avatar: "Y",
    online: true,
  },
];

const ChatPage = () => {
  const [selectedClient, setSelectedClient] = useState(clients[0]);

  const messages = [
    {
      id: 1,
      sender: "client",
      text: "Coach, est-ce que je fais le cardio aujourd'hui ?",
    },
    {
      id: 2,
      sender: "coach",
      text: "Oui bien sûr, 30 minutes après la séance.",
    },
  ];

  return (
    <div className="h-[calc(100vh-120px)] rounded-[2rem] border border-white/10 bg-white/[0.03] overflow-hidden">
      <div className="grid h-full lg:grid-cols-[350px_1fr]">
        <div className="border-r border-white/10 bg-black/40">
          <div className="p-5">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                placeholder="Rechercher..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-3 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2 px-3">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full rounded-2xl p-4 text-left transition ${
                  selectedClient.id === client.id
                    ? "bg-red-600"
                    : "bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center font-black">
                      {client.avatar}
                    </div>

                    {client.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-black" />
                    )}
                  </div>

                  <div>
                    <p className="font-bold">{client.name}</p>
                    <p className="text-xs text-zinc-400">
                      Cliquez pour ouvrir
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="border-b border-white/10 p-5">
            <h2 className="font-black text-xl">
              {selectedClient.name}
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "coach"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md rounded-3xl px-5 py-3 ${
                    msg.sender === "coach"
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
      </div>
    </div>
  );
};

export default ChatPage;