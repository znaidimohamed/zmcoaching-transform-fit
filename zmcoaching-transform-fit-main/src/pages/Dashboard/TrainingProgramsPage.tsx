import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Dumbbell,
  FileDown,
  Plus,
  Trash2,
  UploadCloud,
  Users,
  CheckCircle2,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const TrainingProgramsPage = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    duration: "",
    level: "",
    description: "",
    pdf: null as File | null,
    assignedUsers: [] as string[],
  });

  const fetchPrograms = async () => {
    try {
      const res = await api.get("/training-programs/admin");
      setPrograms(res.data.programs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.users.filter((u: any) => u.role === "user"));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchUsers();
  }, []);

  const toggleAssignedUser = (userId: string) => {
    setForm((current) => {
      const exists = current.assignedUsers.includes(userId);

      return {
        ...current,
        assignedUsers: exists
          ? current.assignedUsers.filter((id) => id !== userId)
          : [...current.assignedUsers, userId],
      };
    });
  };

  const createProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("duration", form.duration);
      formData.append("level", form.level);
      formData.append("description", form.description);
      formData.append("assignedUsers", JSON.stringify(form.assignedUsers));

      if (form.pdf) {
        formData.append("pdf", form.pdf);
      }

      await api.post("/training-programs", formData);

      setForm({
        name: "",
        duration: "",
        level: "",
        description: "",
        pdf: null,
        assignedUsers: [],
      });

      await fetchPrograms();
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id: string) => {
    await api.patch(`/training-programs/${id}/toggle-status`);
    fetchPrograms();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce programme training ?")) return;

    await api.delete(`/training-programs/${id}`);
    fetchPrograms();
  };

  const filteredUsers = users.filter((user) =>
    `${user.fullName} ${user.email}`
      .toLowerCase()
      .includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Training management
        </p>

        <h1 className="text-4xl font-black mt-2">
          Programmes <span className="text-red-500">Training</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Crée les programmes training et choisis les utilisateurs qui peuvent
          les voir.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Plus size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black">Ajouter un programme</h2>
              <p className="text-sm text-zinc-400">
                Niveau, durée, PDF et accès utilisateurs
              </p>
            </div>
          </div>

          <form
            onSubmit={createProgram}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            <Field
              label="Nom du programme"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Ex: Full Body Beginner"
            />

            <Field
              label="Durée"
              value={form.duration}
              onChange={(v) => setForm({ ...form, duration: v })}
              placeholder="Ex: 8 semaines"
            />

            <Field
              label="Niveau"
              value={form.level}
              onChange={(v) => setForm({ ...form, level: v })}
              placeholder="Ex: Débutant / Intermédiaire"
            />

            <div className="lg:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Description
              </label>

              <textarea
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Décris le programme training..."
                className="w-full min-h-28 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Utilisateurs autorisés
              </label>

              <div className="rounded-[1.5rem] bg-black/60 border border-white/10 p-5">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                      <Users size={20} />
                    </div>

                    <div>
                      <p className="font-bold text-white">Accès utilisateurs</p>
                      <p className="text-xs text-zinc-500">
                        {form.assignedUsers.length} utilisateur(s)
                        sélectionné(s)
                      </p>
                    </div>
                  </div>

                  {form.assignedUsers.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, assignedUsers: [] })
                      }
                      className="rounded-xl bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-300 hover:bg-red-600 hover:text-white transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full rounded-2xl bg-black border border-white/10 px-4 py-3 pl-11 outline-none focus:border-red-500"
                  />

                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>

                {users.length === 0 ? (
                  <p className="text-sm text-zinc-500">
                    Aucun utilisateur disponible.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {filteredUsers.map((user) => {
                      const checked = form.assignedUsers.includes(user.id);

                      return (
                        <button
                          type="button"
                          key={user.id}
                          onClick={() => toggleAssignedUser(user.id)}
                          className={`text-left rounded-2xl border p-4 transition group ${
                            checked
                              ? "border-red-500 bg-red-600/15 shadow-lg shadow-red-900/20"
                              : "border-white/10 bg-black/40 hover:border-red-500/40 hover:bg-white/[0.03]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-11 w-11 rounded-2xl flex items-center justify-center font-black ${
                                checked
                                  ? "bg-red-600 text-white"
                                  : "bg-zinc-800 text-zinc-300 group-hover:bg-red-600 group-hover:text-white"
                              }`}
                            >
                              {user.fullName?.charAt(0)?.toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-white truncate">
                                {user.fullName}
                              </p>
                              <p className="text-xs text-zinc-500 truncate">
                                {user.email}
                              </p>
                            </div>

                            <div
                              className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                checked
                                  ? "border-red-500 bg-red-600"
                                  : "border-white/20"
                              }`}
                            >
                              {checked && (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                PDF du programme training
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-black/60 border border-white/10 px-4 py-4 hover:border-red-500 transition">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                    <FileDown size={20} />
                  </div>

                  <div>
                    <p className="font-bold text-white">
                      {form.pdf ? form.pdf.name : "Choisir un PDF"}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Ce PDF apparaîtra pour les utilisateurs autorisés.
                    </p>
                  </div>
                </div>

                <span className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold">
                  <UploadCloud size={16} />
                  Upload PDF
                </span>

                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, pdf: e.target.files?.[0] || null })
                  }
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="lg:col-span-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition disabled:opacity-60 shadow-lg shadow-red-900/30"
            >
              {creating ? "Ajout en cours..." : "Ajouter le programme"}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl">
          <p className="text-red-400 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Live preview
          </p>

          <TrainingCard
            program={{
              name: form.name || "Full Body Beginner",
              duration: form.duration || "8 semaines",
              level: form.level || "Débutant",
              description:
                form.description ||
                "Programme structuré pour progresser avec une base solide.",
              isActive: true,
              pdfName: form.pdf?.name,
              assignedUsers: form.assignedUsers,
            }}
            preview
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <Dumbbell size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Liste des programmes</h2>
            <p className="text-sm text-zinc-400">
              {programs.length} programme(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : programs.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun programme ajouté.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program._id} className="space-y-3">
                <TrainingCard program={program} />

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleStatus(program._id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-bold transition ${
                      program.isActive
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {program.isActive ? "Désactiver" : "Activer"}
                  </button>

                  <button
                    onClick={() => remove(program._id)}
                    className="rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-3 text-red-300 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder }: any) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">{label}</label>

    <input
      required
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
    />
  </div>
);

const TrainingCard = ({ program, preview = false }: any) => (
  <article
    className={`relative overflow-hidden rounded-[2rem] border p-6 min-h-[390px] ${
      !program.isActive && !preview
        ? "border-zinc-700 bg-black/50 opacity-50 grayscale"
        : "border-white/10 bg-black/50"
    }`}
  >
    {!program.isActive && !preview && (
      <div className="absolute right-5 top-5 rounded-full bg-zinc-700 px-4 py-2 text-xs font-black text-zinc-300">
        Inactif
      </div>
    )}

    <div className="h-14 w-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-7">
      <Dumbbell size={26} />
    </div>

    <h3 className="text-2xl font-black">{program.name}</h3>

    <div className="mt-4 flex gap-3 flex-wrap">
      <span className="rounded-full bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 text-xs font-bold">
        {program.level}
      </span>

      <span className="rounded-full bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 text-xs font-bold">
        {program.duration}
      </span>
    </div>

    <p className="text-zinc-400 text-sm mt-5 leading-relaxed">
      {program.description}
    </p>

    {(program.assignedUsers?.length > 0 || preview) && (
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-red-400" />
          <div>
            <p className="text-sm font-bold">Accès utilisateurs</p>
            <p className="text-xs text-zinc-500">
              {program.assignedUsers?.length || 0} utilisateur(s) autorisé(s)
            </p>
          </div>
        </div>
      </div>
    )}

    {(program.pdfName || program.pdfUrl) && (
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex items-center gap-3">
          <FileDown size={20} className="text-red-400" />
          <div>
            <p className="text-sm font-bold">PDF training</p>
            <p className="text-xs text-zinc-500">
              {program.pdfName || "PDF disponible"}
            </p>
          </div>
        </div>

        {program.pdfUrl && (
          <a
            href={`${API_URL}${program.pdfUrl}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-red-400 text-sm font-bold hover:text-red-300"
          >
            Ouvrir PDF
          </a>
        )}
      </div>
    )}
  </article>
);

export default TrainingProgramsPage;