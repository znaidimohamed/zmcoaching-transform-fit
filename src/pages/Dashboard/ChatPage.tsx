import { MessageCircle, Search, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      const list: Client[] = res.data.clients || [];

      setClients(list);

      if (list.length > 0) {
        setSelectedClient((current) => current || list[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchConversation = async (clientId: string) => {
    try {
      setLoadingMessages(true);

      const res = await api.get(`/messages/admin/${clientId}`);
      setMessages(res.data.messages || []);
    } catch (error) {
      console.log(error);
      setMessages([]);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

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
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-95px)] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-2xl">
      <div className="grid h-full min-h-0 lg:grid-cols-[390px_1fr]">
        <aside className="flex h-full min-h-0 flex-col border-r border-white/10 bg-black/50">
          <div className="shrink-0 border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-900/30">
                <MessageCircle size={23} />
              </div>

              <div>
                <h1 className="text-2xl font-black">Messages</h1>
                <p className="text-sm text-zinc-500">
                  Conversations avec les clients
                </p>
              </div>
            </div>

            <div className="relative mt-5">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client..."
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 outline-none transition focus:border-red-500"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {loadingClients ? (
              <div className="py-12 text-center text-zinc-500">
                Chargement...
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="py-12 text-center text-zinc-500">
                Aucun client trouvé.
              </div>
            ) : (
              filteredClients.map((client) => {
                const active = selectedClient?._id === client._id;

                const initials =
                  client.fullName
                    ?.split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "C";

                return (
                  <button
                    key={client._id}
                    onClick={() => setSelectedClient(client)}
                    className={`w-full rounded-3xl p-4 text-left transition ${
                      active
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                        : "bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-sm font-black">
                        {initials}
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

        <section className="flex h-full min-h-0 min-w-0 flex-col">
          {selectedClient ? (
            <>
              <div className="shrink-0 border-b border-white/10 bg-black/30 px-6 py-5">
                <h2 className="text-2xl font-black">
                  {selectedClient.fullName}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {selectedClient.email}
                </p>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
                {loadingMessages ? (
                  <div className="py-10 text-center text-zinc-500">
                    Chargement des messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center">
                    <div>
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
                          className={`max-w-[75%] rounded-3xl px-5 py-3 shadow-lg ${
                            isCoach
                              ? "bg-red-600 text-white shadow-red-950/20"
                              : "bg-white/10 text-zinc-100 shadow-black/20"
                          }`}
                        >
                          <p className="leading-relaxed">{msg.text}</p>

                          <p className="mt-2 text-[11px] opacity-60">
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

                <div ref={messagesEndRef} />
              </div>

              <div className="shrink-0 border-t border-white/10 bg-black/80 p-5">
                <div className="flex items-center gap-3">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        sendMessage();
                      }
                    }}
                    placeholder="Écrire un message..."
                    className="h-14 flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 outline-none transition focus:border-red-500"
                  />

                  <button
                    onClick={sendMessage}
                    disabled={sending || !text.trim()}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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