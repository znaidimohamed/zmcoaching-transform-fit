import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";

const API_URL = "https://zmcoachingbackend.onrender.com/api";

const TransformationsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    beforeImage: null as File | null,
    afterImage: null as File | null,
  });

  const fetchData = async () => {
    try {
      const res = await api.get("/transformations/admin");
      setData(res.data.transformations);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.beforeImage || !form.afterImage) return;

    setCreating(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("beforeImage", form.beforeImage);
      formData.append("afterImage", form.afterImage);

      await api.post("/transformations", formData);

      setForm({
        name: "",
        title: "",
        description: "",
        beforeImage: null,
        afterImage: null,
      });

      await fetchData();
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    const ok = confirm("Supprimer cette transformation ?");
    if (!ok) return;

    await api.delete(`/transformations/${id}`);
    fetchData();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Content management
        </p>
        <h1 className="text-4xl font-black mt-2">
          Transformations <span className="text-red-500">Clients</span>
        </h1>
        <p className="text-zinc-400 mt-2">
          Ajoute les avant/après qui s’affichent automatiquement dans la homepage.
        </p>
      </div>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
            <ImagePlus size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Ajouter une transformation</h2>
            <p className="text-sm text-zinc-400">Images before/after + contenu</p>
          </div>
        </div>

        <form onSubmit={create} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Field
            label="Nom client"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Ex: Ahmed"
          />

          <Field
            label="Titre"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
            placeholder="Ex: -20kg en 12 semaines"
          />

          <div className="lg:col-span-2">
            <label className="text-sm text-zinc-300 mb-2 block">Description</label>
            <textarea
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Décris la transformation..."
              className="w-full min-h-32 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
            />
          </div>

          <FileBox
            label="Image before"
            file={form.beforeImage}
            onChange={(file) => setForm({ ...form, beforeImage: file })}
          />

          <FileBox
            label="Image after"
            file={form.afterImage}
            onChange={(file) => setForm({ ...form, afterImage: file })}
          />

          <button
            type="submit"
            disabled={creating}
            className="lg:col-span-2 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-4 font-black hover:scale-[1.01] transition disabled:opacity-60 shadow-lg shadow-red-900/30"
          >
            {creating ? "Ajout en cours..." : "Ajouter la transformation"}
          </button>
        </form>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black">Liste des transformations</h2>
            <p className="text-sm text-zinc-400">{data.length} transformation(s)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : data.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucune transformation ajoutée.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.map((t) => (
              <article
                key={t._id}
                className="group rounded-3xl overflow-hidden border border-white/10 bg-black/40 hover:border-red-500/50 transition"
              >
                <div className="grid grid-cols-2">
                  <ImagePreview src={`${API_URL}${t.beforeImage}`} label="Before" />
                  <ImagePreview src={`${API_URL}${t.afterImage}`} label="After" />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-black">{t.title}</h3>
                  <p className="text-red-400 text-sm font-bold mt-1">{t.name}</p>
                  <p className="text-zinc-400 text-sm mt-3 line-clamp-3">
                    {t.description}
                  </p>

                  <button
                    onClick={() => remove(t._id)}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-red-600/10 border border-red-500/20 px-4 py-2 text-red-300 hover:bg-red-600 hover:text-white transition"
                  >
                    <Trash2 size={16} />
                    Supprimer
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

const FileBox = ({ label, file, onChange }: any) => (
  <div>
    <label className="text-sm text-zinc-300 mb-2 block">{label}</label>

    <label className="relative flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-black/50 hover:border-red-500/60 transition overflow-hidden">
      {file ? (
        <img
          src={URL.createObjectURL(file)}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      ) : (
        <div className="text-center">
          <UploadCloud className="mx-auto mb-3 text-red-400" size={34} />
          <p className="font-bold">Choisir une image</p>
          <p className="text-xs text-zinc-500 mt-1">PNG, JPG, WEBP</p>
        </div>
      )}

      {file && (
        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-black/70 px-4 py-2 text-sm">
          {file.name}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        required
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </label>
  </div>
);

const ImagePreview = ({ src, label }: any) => (
  <div className="relative h-48 overflow-hidden">
    <img src={src} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-black">
      {label}
    </span>
  </div>
);

export default TransformationsPage;