import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  Apple,
  CheckCircle2,
  Flame,
  Plus,
  Trash2,
  UploadCloud,
  FileDown,
  Users,
} from "lucide-react";

const API_URL = "http://localhost:5000";

const NutritionPlansPage = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    calories: "",
    goal: "",
    meals: "",
    isPopular: false,
    pdf: null as File | null,
    assignedUsers: [] as string[],
  });

  const mealsList = useMemo(() => {
    return form.meals
      .split("\n")
      .map((m) => m.trim())
      .filter(Boolean);
  }, [form.meals]);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/nutrition-plans/admin");
      setPlans(res.data.plans);
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
    fetchPlans();
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

  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await api.post("/nutrition-plans", {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        calories: form.calories,
        goal: form.goal,
        meals: mealsList,
        isPopular: form.isPopular,
        assignedUsers: form.assignedUsers,
      });

      const createdPlan = res.data.plan;

      if (form.pdf) {
        const formData = new FormData();
        formData.append("pdf", form.pdf);

        await api.patch(`/nutrition-plans/${createdPlan._id}/pdf`, formData);
      }

      setForm({
        title: "",
        subtitle: "",
        description: "",
        calories: "",
        goal: "",
        meals: "",
        isPopular: false,
        pdf: null,
        assignedUsers: [],
      });

      await fetchPlans();
    } catch (error) {
      console.log(error);
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce plan nutritionnel ?")) return;

    await api.delete(`/nutrition-plans/${id}`);
    fetchPlans();
  };

  const toggleStatus = async (id: string) => {
    await api.patch(`/nutrition-plans/${id}/toggle-status`);
    fetchPlans();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Nutrition management
        </p>

        <h1 className="text-4xl font-black mt-2">
          Plans <span className="text-red-500">Nutritionnels</span>
        </h1>

        <p className="text-zinc-400 mt-2">
          Crée les plans nutritionnels et choisis les utilisateurs qui peuvent
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
              <h2 className="text-2xl font-black">Ajouter un plan</h2>
              <p className="text-sm text-zinc-400">
                Objectif, calories, repas, PDF et accès utilisateurs
              </p>
            </div>
          </div>

          <form
            onSubmit={createPlan}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            <Field
              label="Titre"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
              placeholder="Ex: Plan Sèche"
            />

            <Field
              label="Sous-titre"
              value={form.subtitle}
              onChange={(v) => setForm({ ...form, subtitle: v })}
              placeholder="Ex: Perte de gras intelligente"
            />

            <Field
              label="Calories"
              value={form.calories}
              onChange={(v) => setForm({ ...form, calories: v })}
              placeholder="Ex: 1800 - 2200 kcal"
            />

            <Field
              label="Objectif"
              value={form.goal}
              onChange={(v) => setForm({ ...form, goal: v })}
              placeholder="Ex: Fat loss"
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
                placeholder="Décris ce type de plan..."
                className="w-full min-h-28 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Repas / points clés — une ligne par élément
              </label>

              <textarea
                required
                value={form.meals}
                onChange={(e) => setForm({ ...form, meals: e.target.value })}
                placeholder={
                  "Petit-déjeuner riche en protéines\nDéjeuner équilibré\nSnack pré-training\nDîner léger"
                }
                className="w-full min-h-36 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
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
                        {form.assignedUsers.length} utilisateur(s) sélectionné(s)
                      </p>
                    </div>
                  </div>

                  {form.assignedUsers.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, assignedUsers: [] })}
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
                    className="w-full rounded-2xl bg-black border border-white/10 px-4 py-3 pl-11 outline-none focus:border-red-500"
                    onChange={(e) => setUserSearch(e.target.value)}
                  />
                  <Users
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                </div>

                {users.length === 0 ? (
                  <p className="text-sm text-zinc-500">Aucun utilisateur disponible.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                    {users
                      .filter((user) =>
                        `${user.fullName} ${user.email}`
                          .toLowerCase()
                          .includes(userSearch.toLowerCase())
                      )
                      .map((user) => {
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
                PDF du plan nutritionnel
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
                      Ce PDF apparaîtra avec ce plan pour les utilisateurs
                      autorisés.
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

            <label className="lg:col-span-2 flex items-center justify-between rounded-2xl bg-black/50 border border-white/10 px-4 py-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Flame size={20} className="text-red-400" />

                <div>
                  <p className="font-bold">Plan populaire</p>
                  <p className="text-xs text-zinc-500">
                    Affiche ce plan comme recommandation principale
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={form.isPopular}
                onChange={(e) =>
                  setForm({ ...form, isPopular: e.target.checked })
                }
                className="h-5 w-5 accent-red-600"
              />
            </label>

            <button
              type="submit"
              disabled={creating}
              className="lg:col-span-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition disabled:opacity-60 shadow-lg shadow-red-900/30"
            >
              {creating ? "Ajout en cours..." : "Ajouter le plan"}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl">
          <p className="text-red-400 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Live preview
          </p>

          <NutritionCard
            plan={{
              title: form.title || "Plan Sèche",
              subtitle: form.subtitle || "Perte de gras intelligente",
              description:
                form.description ||
                "Plan alimentaire structuré pour perdre du gras sans casser l’énergie.",
              calories: form.calories || "1800 - 2200 kcal",
              goal: form.goal || "Fat loss",
              meals:
                mealsList.length > 0
                  ? mealsList
                  : [
                      "Petit-déjeuner riche en protéines",
                      "Déjeuner équilibré",
                      "Snack pré-training",
                      "Dîner léger",
                    ],
              isPopular: form.isPopular,
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
            <Apple size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Liste des plans</h2>
            <p className="text-sm text-zinc-400">{plans.length} plan(s)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : plans.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun plan ajouté.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan._id} className="space-y-3">
                <NutritionCard plan={plan} />

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleStatus(plan._id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-bold transition ${
                      plan.isActive
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {plan.isActive ? "Désactiver" : "Activer"}
                  </button>

                  <button
                    onClick={() => remove(plan._id)}
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

const NutritionCard = ({ plan, preview = false }: any) => (
  <article
    className={`relative overflow-hidden rounded-[2rem] border p-6 min-h-[430px] ${
      plan.isPopular
        ? "border-red-500/60 bg-gradient-to-br from-red-950/50 to-black shadow-2xl shadow-red-900/20"
        : "border-white/10 bg-black/50"
    } ${!plan.isActive && !preview ? "opacity-50 grayscale" : ""}`}
  >
    {plan.isPopular && (
      <div className="absolute right-5 top-5 rounded-full bg-red-600 px-4 py-2 text-xs font-black">
        Populaire
      </div>
    )}

    {!plan.isActive && !preview && (
      <div className="absolute left-5 top-5 rounded-full bg-zinc-700 px-4 py-2 text-xs font-black text-zinc-300">
        Inactif
      </div>
    )}

    <div className="h-14 w-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-7">
      <Apple size={26} />
    </div>

    <h3 className="text-2xl font-black">{plan.title}</h3>

    <p className="text-zinc-400 mt-2">{plan.subtitle}</p>

    <div className="mt-6 flex gap-3 flex-wrap">
      <span className="rounded-full bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 text-xs font-bold">
        {plan.goal}
      </span>

      <span className="rounded-full bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 text-xs font-bold">
        {plan.calories}
      </span>
    </div>

    <p className="text-zinc-400 text-sm mt-5 leading-relaxed">
      {plan.description}
    </p>

    <ul className="mt-6 space-y-3">
      {plan.meals?.map((meal: string, index: number) => (
        <li key={index} className="flex items-start gap-3 text-zinc-300">
          <CheckCircle2 size={18} className="text-red-400 mt-0.5 shrink-0" />
          <span>{meal}</span>
        </li>
      ))}
    </ul>

    {(plan.assignedUsers?.length > 0 || preview) && (
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-red-400" />
          <div>
            <p className="text-sm font-bold">Accès utilisateurs</p>
            <p className="text-xs text-zinc-500">
              {plan.assignedUsers?.length || 0} utilisateur(s) autorisé(s)
            </p>
          </div>
        </div>
      </div>
    )}

    {(plan.pdfName || plan.pdfUrl) && (
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
        <div className="flex items-center gap-3">
          <FileDown size={20} className="text-red-400" />
          <div>
            <p className="text-sm font-bold">PDF nutrition</p>
            <p className="text-xs text-zinc-500">
              {plan.pdfName || "PDF disponible"}
            </p>
          </div>
        </div>

        {plan.pdfUrl && (
          <a
            href={`${API_URL}${plan.pdfUrl}`}
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

export default NutritionPlansPage;