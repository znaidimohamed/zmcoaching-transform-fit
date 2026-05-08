import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  GraduationCap,
  Plus,
  Trash2,
  Dumbbell,
  Apple,
  Star,
} from "lucide-react";

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "training",
    description: "",
    price: "",
    duration: "",
    level: "",
    features: "",
    isPopular: false,
  });

  const featuresList = useMemo(() => {
    return form.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  }, [form.features]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/admin");
      setCourses(res.data.courses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      await api.post("/courses", {
        ...form,
        features: featuresList,
      });

      setForm({
        title: "",
        category: "training",
        description: "",
        price: "",
        duration: "",
        level: "",
        features: "",
        isPopular: false,
      });

      await fetchCourses();
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (id: string) => {
    await api.patch(`/courses/${id}/toggle-status`);
    fetchCourses();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce course ?")) return;
    await api.delete(`/courses/${id}`);
    fetchCourses();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-red-400 font-bold tracking-[0.25em] uppercase text-xs">
          Courses management
        </p>
        <h1 className="text-4xl font-black mt-2">
          Courses <span className="text-red-500">Shop</span>
        </h1>
        <p className="text-zinc-400 mt-2">
          Gère les cours payants affichés dans la homepage.
        </p>
      </div>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
              <Plus size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Ajouter un course</h2>
              <p className="text-sm text-zinc-400">
                Training ou nutrition, prix et features
              </p>
            </div>
          </div>

          <form onSubmit={createCourse} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Field
              label="Titre"
              value={form.title}
              onChange={(v) => setForm({ ...form, title: v })}
              placeholder="Ex: Programme Transformation"
            />

            <div>
              <label className="text-sm text-zinc-300 mb-2 block">
                Catégorie
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              >
                <option value="training">Training</option>
                <option value="nutrition">Nutrition</option>
              </select>
            </div>

            <Field
              label="Prix"
              value={form.price}
              onChange={(v) => setForm({ ...form, price: v })}
              placeholder="Ex: 149 DT"
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
              placeholder="Ex: Débutant"
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
                placeholder="Décris le course..."
                className="w-full min-h-28 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="text-sm text-zinc-300 mb-2 block">
                Features — une ligne par feature
              </label>
              <textarea
                required
                value={form.features}
                onChange={(e) =>
                  setForm({ ...form, features: e.target.value })
                }
                placeholder={"PDF détaillé\nSuivi structuré\nRésultats visibles"}
                className="w-full min-h-32 rounded-2xl bg-black/60 border border-white/10 px-4 py-3 outline-none focus:border-red-500"
              />
            </div>

            <label className="lg:col-span-2 flex items-center justify-between rounded-2xl bg-black/50 border border-white/10 px-4 py-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <Star size={20} className="text-red-400" />
                <div>
                  <p className="font-bold">Course populaire</p>
                  <p className="text-xs text-zinc-500">
                    Affiche badge Populaire dans la homepage
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
              {creating ? "Ajout en cours..." : "Ajouter le course"}
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-red-500/20 bg-gradient-to-br from-red-950/30 to-black p-6 shadow-2xl">
          <p className="text-red-400 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            Live preview
          </p>

          <CourseCard
            course={{
              ...form,
              features:
                featuresList.length > 0
                  ? featuresList
                  : ["PDF détaillé", "Suivi structuré", "Résultats visibles"],
              isActive: true,
            }}
            preview
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
            <GraduationCap size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Liste des courses</h2>
            <p className="text-sm text-zinc-400">
              {courses.length} course(s)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-zinc-400 py-12 text-center">Chargement...</div>
        ) : courses.length === 0 ? (
          <div className="text-zinc-500 py-12 text-center border border-dashed border-white/10 rounded-3xl">
            Aucun course ajouté.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="space-y-3">
                <CourseCard course={course} />

                <div className="flex gap-3">
                  <button
                    onClick={() => toggleStatus(course._id)}
                    className={`flex-1 rounded-2xl px-4 py-3 font-bold transition ${
                      course.isActive
                        ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {course.isActive ? "Désactiver" : "Activer"}
                  </button>

                  <button
                    onClick={() => remove(course._id)}
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

const CourseCard = ({ course, preview = false }: any) => (
  <article
    className={`relative rounded-[2rem] border p-6 bg-black/50 min-h-[380px] ${
      course.isPopular
        ? "border-red-500/60 shadow-2xl shadow-red-900/20"
        : "border-white/10"
    } ${!course.isActive && !preview ? "opacity-50 grayscale" : ""}`}
  >
    {course.isPopular && (
      <div className="absolute right-5 top-5 rounded-full bg-red-600 px-4 py-2 text-xs font-black">
        Populaire
      </div>
    )}

    <div className="h-14 w-14 rounded-2xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center mb-7">
      {course.category === "training" ? <Dumbbell size={26} /> : <Apple size={26} />}
    </div>

    <h3 className="text-2xl font-black">
      {course.title || "Course title"}
    </h3>

    <p className="text-zinc-400 mt-3">
      {course.description || "Description du course..."}
    </p>

    <div className="mt-6 flex gap-3 flex-wrap">
      <span className="rounded-full bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 text-xs font-bold">
        {course.category}
      </span>

      {course.level && (
        <span className="rounded-full bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 text-xs font-bold">
          {course.level}
        </span>
      )}

      {course.duration && (
        <span className="rounded-full bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 text-xs font-bold">
          {course.duration}
        </span>
      )}
    </div>

    <p className="text-4xl font-black text-red-500 mt-6">
      {course.price || "99 DT"}
    </p>

    <ul className="space-y-2 mt-6 text-sm text-zinc-300">
      {course.features?.map((f: string, i: number) => (
        <li key={i}>✓ {f}</li>
      ))}
    </ul>
  </article>
);

export default CoursesPage;