import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CalendarDays, Clock, Plus, Trash2, Users } from "lucide-react";

const days = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const SchedulePage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    day: "Lundi",
    startTime: "",
    endTime: "",
    title: "",
    type: "Training",
    notes: "",
  });

  const fetchUsers = async () => {
    const res = await api.get("/users");

    const onlyUsers = res.data.users.filter(
      (u: any) => u.role === "user"
    );

    setUsers(onlyUsers);

    if (onlyUsers.length > 0 && !selectedUserId) {
      setSelectedUserId(onlyUsers[0].id);
    }
  };

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/schedules/admin");
      setSchedules(res.data.schedules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSchedules();
  }, []);

  const createSchedule = async (e: React.FormEvent) => {
    e.preventDefault();

    await api.post("/schedules", {
      user: selectedUserId,
      ...form,
    });

    setForm({
      day: "Lundi",
      startTime: "",
      endTime: "",
      title: "",
      type: "Training",
      notes: "",
    });

    fetchSchedules();
  };

  const toggleStatus = async (id: string) => {
    await api.patch(`/schedules/${id}/toggle-status`);
    fetchSchedules();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette séance ?")) return;

    await api.delete(`/schedules/${id}`);
    fetchSchedules();
  };

  const filteredSchedules = selectedUserId
    ? schedules.filter(
        (item) =>
          item.user?._id === selectedUserId ||
          item.user?.id === selectedUserId
      )
    : schedules;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Client scheduler
        </p>

        <h1 className="text-4xl font-black mt-2">
          Training <span className="text-red-500">Schedule</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Ajoute les horaires d’entraînement pour chaque client.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
              <Users size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">Client</h2>

              <p className="text-sm text-zinc-400">
                Choisis le client
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
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
              <Plus size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                Ajouter une séance
              </h2>

              <p className="text-sm text-zinc-400">
                Jour, horaire, type et notes
              </p>
            </div>
          </div>

          <form
            onSubmit={createSchedule}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Jour
              </label>

              <select
                value={form.day}
                onChange={(e) =>
                  setForm({ ...form, day: e.target.value })
                }
                className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              >
                {days.map((day) => (
                  <option key={day}>{day}</option>
                ))}
              </select>
            </div>

            <Field
              label="Titre"
              value={form.title}
              onChange={(v: string) =>
                setForm({ ...form, title: v })
              }
              placeholder="Ex: Leg Day"
            />

            <Field
              label="Début"
              type="time"
              value={form.startTime}
              onChange={(v: string) =>
                setForm({ ...form, startTime: v })
              }
            />

            <Field
              label="Fin"
              type="time"
              value={form.endTime}
              onChange={(v: string) =>
                setForm({ ...form, endTime: v })
              }
            />

            <Field
              label="Type"
              value={form.type}
              onChange={(v: string) =>
                setForm({ ...form, type: v })
              }
              placeholder="Ex: Salle / Cardio"
            />

            <div className="md:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Notes
              </label>

              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                placeholder="Notes pour le client..."
                className="w-full min-h-24 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <button
              disabled={!selectedUserId}
              className="md:col-span-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition disabled:opacity-60"
            >
              Ajouter séance
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <CalendarDays size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Planning</h2>

            <p className="text-sm text-zinc-400">
              {filteredSchedules.length} séance(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">
            Chargement...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun horaire ajouté.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSchedules.map((item) => (
              <article
                key={item._id}
                className={`rounded-[2rem] border p-6 bg-black/50 ${
                  item.isActive
                    ? "border-white/10"
                    : "border-zinc-700 opacity-50 grayscale"
                }`}
              >
                <p className="text-red-400 text-sm font-bold">
                  {item.day}
                </p>

                <h3 className="text-2xl font-black mt-2">
                  {item.title}
                </h3>

                <div className="mt-4 flex items-center gap-3 text-zinc-300">
                  <Clock size={18} />

                  <span>
                    {item.startTime} - {item.endTime}
                  </span>
                </div>

                <p className="mt-3 text-sm text-zinc-400">
                  Client: {item.user?.fullName}
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  {item.type}
                </p>

                {item.notes && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-300">
                    {item.notes}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => toggleStatus(item._id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-bold transition ${
                      item.isActive
                        ? "bg-zinc-800 hover:bg-zinc-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {item.isActive
                      ? "Désactiver"
                      : "Activer"}
                  </button>

                  <button
                    onClick={() => remove(item._id)}
                    className="rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">
      {label}
    </label>

    <input
      required
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
    />
  </div>
);

export default SchedulePage;