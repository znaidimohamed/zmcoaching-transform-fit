import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { Box, Plus, Star, Trash2, CheckCircle2 } from "lucide-react";

const PacksPage = () => {
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    price: "",
    duration: "",
    features: "",
    isPopular: false,
  });

  const featuresList = useMemo(() => {
    return form.features
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }, [form.features]);

  const fetchPacks = async () => {
    try {
      const res = await api.get("/packs/admin");
      setPacks(res.data.packs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacks();
  }, []);

  const createPack = async (e: React.FormEvent) => {
    e.preventDefault();

    setCreating(true);

    try {
      await api.post("/packs", {
        ...form,
        features: featuresList,
      });

      setForm({
        name: "",
        subtitle: "",
        price: "",
        duration: "",
        features: "",
        isPopular: false,
      });

      await fetchPacks();
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    const ok = confirm("Supprimer ce pack ?");
    if (!ok) return;

    await api.delete(`/packs/${id}`);
    fetchPacks();
  };

  const toggleStatus = async (id: string) => {
    await api.patch(`/packs/${id}/toggle-status`);
    fetchPacks();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Offers management
        </p>
        <h1 className="text-4xl font-black mt-2">
          Packs <span className="text-red-500">Coaching</span>
        </h1>
        <p className="text-zinc-400 mt-2">
          Crée et gère les packs affichés automatiquement dans la homepage.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        {/* FORM */}
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Ajouter un pack</h2>
              <p className="text-sm text-zinc-400">
                Prix, durée, contenu et statut populaire
              </p>
            </div>
          </div>

          <form onSubmit={createPack} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field
              label="Nom du pack"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Ex: Pack Premium"
            />

            <Field
              label="Sous-titre"
              value={form.subtitle}
              onChange={(v) => setForm({ ...form, subtitle: v })}
              placeholder="Ex: Transformation complète"
            />

            <Field
              label="Prix"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
              placeholder="Ex: 199 DT"
            />

            <Field
              label="Durée"
              value={form.duration}
              onChange={(v) => setForm({ ...form, duration: v })}
              placeholder="Ex: / mois"
            />

            <div className="lg:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Features — une ligne par feature
              </label>
              <textarea
                required
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder={"Plan nutrition personnalisé\nProgramme training\nSuivi WhatsApp\nCheck-in hebdomadaire"}
                className="w-full min-h-36 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <label className="lg:col-span-2 flex items-center justify-between rounded-2xl bg-black/50 border border-white/10 px-4 py-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Star size={20} className="text-red-400" />
                <div>
                  <p className="font-bold">Pack populaire</p>
                  <p className="text-xs text-zinc-500">
                    Affiche un badge “Populaire” dans la homepage
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
              {creating ? "Ajout en cours..." : "Ajouter le pack"}
            </button>
          </form>
        </div>

        {/* LIVE PREVIEW */}
        <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl">
          <p className="text-red-400 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Live preview
          </p>

          <PackCard
            pack={{
              name: form.name || "Pack Premium",
              subtitle: form.subtitle || "Transformation complète",
              price: form.price || "199 DT",
              duration: form.duration || "/ mois",
              features:
                featuresList.length > 0
                  ? featuresList
                  : [
                      "Plan nutrition personnalisé",
                      "Programme training",
                      "Suivi WhatsApp",
                    ],
              isPopular: form.isPopular,
              isActive: true,
            }}
            preview
          />
        </div>
      </section>

      {/* LIST */}
      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <Box size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Liste des packs</h2>
            <p className="text-sm text-zinc-400">{packs.length} pack(s)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : packs.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun pack ajouté.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {packs.map((pack) => (
              <div key={pack._id} className="space-y-3">
                <PackCard pack={pack} />

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleStatus(pack._id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-bold transition ${
                      pack.isActive
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {pack.isActive ? "Désactiver" : "Activer"}
                  </button>

                  <button
                    onClick={() => remove(pack._id)}
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

const PackCard = ({ pack, preview = false }: any) => {
  return (
    <article
      className={`relative overflow-hidden rounded-[2rem] border p-6 min-h-[420px] ${
        pack.isPopular
          ? "border-red-500/60 bg-gradient-to-br from-red-950/50 to-black shadow-2xl shadow-red-900/20"
          : "border-white/10 bg-black/50"
      } ${!pack.isActive && !preview ? "opacity-50 grayscale" : ""}`}
    >
      {pack.isPopular && (
        <div className="absolute right-5 top-5 rounded-full bg-red-600 px-4 py-2 text-xs font-black">
          Populaire
        </div>
      )}

      {!pack.isActive && !preview && (
        <div className="absolute left-5 top-5 rounded-full bg-zinc-700 px-4 py-2 text-xs font-black text-zinc-300">
          Inactif
        </div>
      )}

      <div className="relative z-10 pt-10">
        <h3 className="text-2xl font-black">{pack.name}</h3>
        <p className="text-zinc-400 mt-2">{pack.subtitle}</p>

        <div className="mt-7 flex items-end gap-2">
          <span className="text-5xl font-black text-red-500">
            {pack.price}
          </span>
          <span className="text-zinc-500 pb-2">{pack.duration}</span>
        </div>

        <ul className="mt-8 space-y-3">
          {pack.features?.map((feature: string, index: number) => (
            <li key={index} className="flex items-start gap-3 text-zinc-300">
              <CheckCircle2 size={18} className="text-red-400 mt-0.5 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

export default PacksPage;