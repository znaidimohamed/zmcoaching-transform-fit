import { Search, Send, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type Client = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
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

const ChatPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [search, setSearch] = useState("");
  const [text, setText] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get("/messages/admin/clients");
      const list = res.data.clients || [];

      setClients(list);

      if (list.length > 0) {
        setSelectedClient(list[0]);
      }
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchConversation = async (clientId: string) => {
    try {
      setLoadingMessages(true);
      const res = await api.get(`/messages/admin/${clientId}`);
      setMessages(res.data.messages || []);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient?._id) {
      fetchConversation(selectedClient._id);
    }
  }, [selectedClient?._id]);

  const filteredClients = useMemo(() => {
    return clients.filter((client) =>
      `${client.fullName} ${client.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [clients, search]);

  const sendMessage = async () => {
    if (!selectedClient || !text.trim() || sending) return;

    try {
      setSending(true);

      const res = await api.post(`/messages/admin/${selectedClient._id}`, {
        text: text.trim(),
      });

      setMessages((prev) => [...prev, res.data.chatMessage]);
      setText("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl">
      <div className="grid h-full lg:grid-cols-[370px_1fr]">
        <aside className="border-r border-white/10 bg-black/50">
          <div className="border-b border-white/10 p-5">
            <h1 className="text-2xl font-black">Messages</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Conversations avec les clients
            </p>

            <div className="relative mt-5">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="h-[calc(100%-132px)] space-y-2 overflow-y-auto p-3">
            {loadingClients ? (
              <div className="py-10 text-center text-zinc-500">
                Chargement...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="py-10 text-center text-zinc-500">
                Aucun client trouvé.
              </div>
            ) : (
              filteredClients.map((client) => {
                const active = selectedClient?._id === client._id;
                const initials = client.fullName
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <button
                    key={client._id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full rounded-2xl p-4 text-left transition ${
                      active
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                        : "bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black font-black">
                        {initials || "C"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-black">
                          {client.fullName}
                        </p>
                        <p
                          className={`truncate text-xs ${
                            active ? "text-white/70" : "text-zinc-500"
                          }`}
                        >
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex min-w-0 flex-col">
          {selectedClient ? (
            <>
              <div className="border-b border-white/10 bg-black/30 p-5">
                <h2 className="text-xl font-black">
                  {selectedClient.fullName}
                </h2>
                <p className="text-sm text-zinc-500">
                  {selectedClient.email}
                </p>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-6">
                {loadingMessages ? (
                  <div className="py-10 text-center text-zinc-500">
                    Chargement des messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-600/15 text-red-400">
                        <MessageCircle size={30} />
                      </div>
                      <p className="font-black">Aucun message</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        Commence la conversation avec ce client.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isCoach = msg.sender?.role === "admin";

                    return (
                      <div
                        key={msg._id}
                        className={`flex ${
                          isCoach ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-3xl px-5 py-3 ${
                            isCoach
                              ? "bg-red-600 text-white"
                              : "bg-white/10 text-zinc-100"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>
                          <p
                            className={`mt-2 text-[11px] ${
                              isCoach ? "text-white/60" : "text-zinc-500"
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

              <div className="border-t border-white/10 bg-black/30 p-5">
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
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              Sélectionne un client.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ChatPage;