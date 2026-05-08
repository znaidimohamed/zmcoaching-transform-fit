import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { TrendingUp, Plus, Trash2, Users } from "lucide-react";

const ProgressPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    date: "",
    weight: "",
    waist: "",
    chest: "",
    arms: "",
    notes: "",
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const latestEntry = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[entries.length - 1];
  }, [entries]);

  const fetchUsers = async () => {
    const res = await api.get("/users");
    const onlyUsers = res.data.users.filter((u: any) => u.role === "user");
    setUsers(onlyUsers);

    if (onlyUsers.length > 0) {
      setSelectedUserId(onlyUsers[0].id);
    }
  };

  const fetchProgress = async (userId: string) => {
    if (!userId) return;

    setLoading(true);

    try {
      const res = await api.get(`/progress/user/${userId}`);
      setEntries(res.data.entries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      fetchProgress(selectedUserId);
    }
  }, [selectedUserId]);

  const createEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/progress", {
      user: selectedUserId,
      date: form.date || new Date().toISOString(),
      weight: Number(form.weight),
      waist: form.waist ? Number(form.waist) : undefined,
      chest: form.chest ? Number(form.chest) : undefined,
      arms: form.arms ? Number(form.arms) : undefined,
      notes: form.notes,
    });

    setForm({
      date: "",
      weight: "",
      waist: "",
      chest: "",
      arms: "",
      notes: "",
    });

    fetchProgress(selectedUserId);
  };

  const removeEntry = async (id: string) => {
    if (!confirm("Supprimer cette entrée progress ?")) return;

    await api.delete(`/progress/${id}`);
    fetchProgress(selectedUserId);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Client evolution
        </p>

        <h1 className="text-4xl font-black mt-2">
          Progress <span className="text-red-500">Tracking</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Ajoute et suis l’évolution physique des clients.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Users size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">Client</h2>
              <p className="text-sm text-zinc-400">
                Choisis le client à suivre
              </p>
            </div>
          </div>

          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} — {user.email}
              </option>
            ))}
          </select>

          {selectedUser && (
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-4">
              <p className="font-black">{selectedUser.fullName}</p>
              <p className="text-sm text-zinc-500">{selectedUser.email}</p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Goal" value={selectedUser.goal || "-"} />
                <Info label="Activity" value={selectedUser.activityLevel || "-"} />
                <Info label="Height" value={selectedUser.height ? `${selectedUser.height} cm` : "-"} />
                <Info label="Weight" value={selectedUser.weight ? `${selectedUser.weight} kg` : "-"} />
              </div>
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Plus size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">Ajouter une entrée</h2>
              <p className="text-sm text-zinc-400">
                Poids, mensurations et note coach
              </p>
            </div>
          </div>

          <form onSubmit={createEntry} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => setForm({ ...form, date: v })}
            />

            <Field
              label="Poids"
              type="number"
              value={form.weight}
              onChange={(v) => setForm({ ...form, weight: v })}
              placeholder="Ex: 78"
              required
            />

            <Field
              label="Tour de taille"
              type="number"
              value={form.waist}
              onChange={(v) => setForm({ ...form, waist: v })}
              placeholder="Ex: 88"
            />

            <Field
              label="Poitrine"
              type="number"
              value={form.chest}
              onChange={(v) => setForm({ ...form, chest: v })}
              placeholder="Ex: 102"
            />

            <Field
              label="Bras"
              type="number"
              value={form.arms}
              onChange={(v) => setForm({ ...form, arms: v })}
              placeholder="Ex: 35"
            />

            <div className="md:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Notes coach
              </label>

              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Ex: Bonne progression cette semaine..."
                className="w-full min-h-28 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedUserId}
              className="md:col-span-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition disabled:opacity-60 shadow-lg shadow-red-900/30"
            >
              Ajouter progress
            </button>
          </form>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <StatCard title="Entrées" value={entries.length} />
        <StatCard
          title="Dernier poids"
          value={latestEntry ? `${latestEntry.weight} kg` : "-"}
        />
        <StatCard
          title="Dernière date"
          value={
            latestEntry
              ? new Date(latestEntry.date).toLocaleDateString()
              : "-"
          }
        />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Historique</h2>
            <p className="text-sm text-zinc-400">
              Evolution du client sélectionné
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : entries.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun progress ajouté pour ce client.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry._id}
                className="rounded-3xl border border-white/10 bg-black/40 p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
              >
                <div>
                  <p className="text-red-400 text-sm font-bold">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>

                  <h3 className="text-2xl font-black mt-1">
                    {entry.weight} kg
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-300">
                    {entry.waist && <Badge label={`Taille: ${entry.waist} cm`} />}
                    {entry.chest && <Badge label={`Poitrine: ${entry.chest} cm`} />}
                    {entry.arms && <Badge label={`Bras: ${entry.arms} cm`} />}
                  </div>

                  {entry.notes && (
                    <p className="text-zinc-400 text-sm mt-4">
                      {entry.notes}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => removeEntry(entry._id)}
                  className="rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text", required = false }: any) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">{label}</label>
    <input
      required={required}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
    />
  </div>
);

const Info = ({ label, value }: any) => (
  <div className="rounded-xl bg-white/[0.04] border border-white/10 p-3">
    <p className="text-xs text-zinc-500">{label}</p>
    <p className="font-bold text-white">{value}</p>
  </div>
);

const StatCard = ({ title, value }: any) => (
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6">
    <p className="text-sm text-zinc-400">{title}</p>
    <h3 className="text-3xl font-black mt-2">{value}</h3>
  </div>
);

const Badge = ({ label }: any) => (
  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1">
    {label}
  </span>
);

export default ProgressPage;