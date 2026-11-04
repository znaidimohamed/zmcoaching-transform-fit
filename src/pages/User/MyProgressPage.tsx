import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  Activity,
  Calendar,
  LineChart,
  MessageSquare,
  TrendingUp,
  Award,
  Dumbbell,
  Flame,
  Plus,
  Send,
  Sparkles,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

const initialPRs = {
  bench: "85 kg",
  squat: "115 kg",
  deadlift: "140 kg",
  run5k: "24:15 min",
  hyrox: "1h 12m",
};

const MyProgressPage = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [prs, setPrs] = useState(initialPRs);

  // New Performance Entry Form State
  const [form, setForm] = useState({
    weight: "",
    waist: "",
    chest: "",
    arms: "",
    bench: "",
    squat: "",
    deadlift: "",
    notes: "",
  });

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get("/progress/me");
      const fetched = res.data.entries || [];
      if (fetched.length > 0) {
        setEntries(fetched);
      } else {
        // Fallback progress timeline
        setEntries([
          { _id: "p1", date: "2026-09-01", weight: 86.0, waist: 92, chest: 104, arms: 37, notes: "Bilan initial." },
          { _id: "p2", date: "2026-09-20", weight: 83.5, waist: 89, chest: 104, arms: 37.5, notes: "Bonne perte de gras." },
          { _id: "p3", date: "2026-10-10", weight: 81.2, waist: 86, chest: 105, arms: 38, notes: "Hypertrophie musculaire." },
          { _id: "p4", date: "2026-11-01", weight: 79.8, waist: 84, chest: 106, arms: 38.5, notes: "Résultats impressionnants !" },
        ]);
      }
    } catch (error) {
      console.log("Using local progress entries", error);
      setEntries([
        { _id: "p1", date: "2026-09-01", weight: 86.0, waist: 92, chest: 104, arms: 37, notes: "Bilan initial." },
        { _id: "p2", date: "2026-09-20", weight: 83.5, waist: 89, chest: 104, arms: 37.5, notes: "Bonne perte de gras." },
        { _id: "p3", date: "2026-10-10", weight: 81.2, waist: 86, chest: 105, arms: 38, notes: "Hypertrophie musculaire." },
        { _id: "p4", date: "2026-11-01", weight: 79.8, waist: 84, chest: 106, arms: 38.5, notes: "Résultats impressionnants !" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weight) {
      toast.error("Veuillez saisir votre poids actuel.");
      return;
    }

    try {
      await api.post("/progress", {
        date: new Date().toISOString(),
        weight: Number(form.weight),
        waist: form.waist ? Number(form.waist) : undefined,
        chest: form.chest ? Number(form.chest) : undefined,
        arms: form.arms ? Number(form.arms) : undefined,
        notes: form.notes,
      });

      if (form.bench) setPrs((prev) => ({ ...prev, bench: `${form.bench} kg` }));
      if (form.squat) setPrs((prev) => ({ ...prev, squat: `${form.squat} kg` }));
      if (form.deadlift) setPrs((prev) => ({ ...prev, deadlift: `${form.deadlift} kg` }));

      toast.success("Nouveau bilan de performance enregistré !");
      setForm({ weight: "", waist: "", chest: "", arms: "", bench: "", squat: "", deadlift: "", notes: "" });
      fetchProgress();
    } catch (err) {
      // Local fallback
      setEntries((prev) => [
        ...prev,
        {
          _id: "local-" + Date.now(),
          date: new Date().toISOString(),
          weight: Number(form.weight),
          waist: form.waist ? Number(form.waist) : undefined,
          chest: form.chest ? Number(form.chest) : undefined,
          arms: form.arms ? Number(form.arms) : undefined,
          notes: form.notes || "Entrée ajoutée par l'athlète",
        },
      ]);
      toast.success("Bilan enregistré !");
      setForm({ weight: "", waist: "", chest: "", arms: "", bench: "", squat: "", deadlift: "", notes: "" });
    }
  };

  const latest = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[entries.length - 1];
  }, [entries]);

  const first = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[0];
  }, [entries]);

  const weightDifference = useMemo(() => {
    if (!first || !latest) return null;
    return Number((latest.weight - first.weight).toFixed(1));
  }, [first, latest]);

  const maxWeight = Math.max(...entries.map((e) => e.weight), 1);
  const minWeight = Math.min(...entries.map((e) => e.weight), 0);
  const range = maxWeight - minWeight || 1;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-bold text-red-400 mb-2 backdrop-blur-xl">
            <Sparkles size={14} /> Espace Performance & PRs Athlète
          </div>

          <h1 className="text-4xl font-black text-white">
            Mon <span className="text-red-500">Suivi de Performance</span>
          </h1>

          <p className="text-zinc-400 mt-1">
            Visualise tes courbes de poids, tes mensurations et tes records personnels (PRs).
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-zinc-400 py-12 text-center">Chargement des données...</div>
      ) : (
        <>
          {/* TOP KPI CARDS */}
          <section className="grid sm:grid-cols-3 gap-6">
            <StatCard
              title="Dernier Poids Relevé"
              value={`${latest?.weight || 80} kg`}
              icon={<TrendingUp size={24} />}
            />

            <StatCard
              title="Variation Totale"
              value={
                weightDifference === null
                  ? "-"
                  : `${weightDifference > 0 ? "+" : ""}${weightDifference} kg`
              }
              icon={<Activity size={24} />}
            />

            <StatCard
              title="Bilan(s) Enregistré(s)"
              value={entries.length}
              icon={<Calendar size={24} />}
            />
          </section>

          {/* PERSONAL RECORDS (PRS) BOARD */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black flex items-center gap-2 text-white">
                  <Award className="text-red-500" size={24} />
                  Mes Records Personnels (PRs)
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Poids maximaux et chronos enregistrés
                </p>
              </div>

              <span className="rounded-full bg-red-600 px-4 py-1 text-xs font-black text-white">
                Race Ready
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <PRBox label="Bench Press" value={prs.bench} icon={Dumbbell} />
              <PRBox label="Squat" value={prs.squat} icon={Dumbbell} />
              <PRBox label="Deadlift" value={prs.deadlift} icon={Dumbbell} />
              <PRBox label="Chrono 5km" value={prs.run5k} icon={Activity} />
              <PRBox label="Temps HYROX" value={prs.hyrox} icon={Flame} />
            </div>
          </section>

          {/* PERFORMANCE LOG & GRAPH GRID */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ADD PERFORMANCE LOG FORM */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl space-y-4">
              <h3 className="font-black text-xl text-white flex items-center gap-2">
                <Plus size={20} className="text-red-500" /> Loguer une Séance / Bilan
              </h3>

              <form onSubmit={handleAddProgress} className="space-y-4 text-xs">
                <div>
                  <label className="text-zinc-300 block mb-1 font-bold">Poids Actuel (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    placeholder="Ex: 80.5"
                    className="w-full rounded-2xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none focus:border-red-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-bold">Taille (cm)</label>
                    <input
                      type="number"
                      value={form.waist}
                      onChange={(e) => setForm({ ...form, waist: e.target.value })}
                      placeholder="85"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-bold">Poitrine</label>
                    <input
                      type="number"
                      value={form.chest}
                      onChange={(e) => setForm({ ...form, chest: e.target.value })}
                      placeholder="104"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-bold">Bras (cm)</label>
                    <input
                      type="number"
                      value={form.arms}
                      onChange={(e) => setForm({ ...form, arms: e.target.value })}
                      placeholder="38"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                  <div>
                    <label className="text-zinc-300 block mb-1 font-bold">PR Couché</label>
                    <input
                      type="number"
                      value={form.bench}
                      onChange={(e) => setForm({ ...form, bench: e.target.value })}
                      placeholder="85"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-bold">PR Squat</label>
                    <input
                      type="number"
                      value={form.squat}
                      onChange={(e) => setForm({ ...form, squat: e.target.value })}
                      placeholder="115"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-300 block mb-1 font-bold">PR Terre</label>
                    <input
                      type="number"
                      value={form.deadlift}
                      onChange={(e) => setForm({ ...form, deadlift: e.target.value })}
                      placeholder="140"
                      className="w-full rounded-xl bg-black/60 border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-zinc-300 block mb-1 font-bold">Ressenti & Message pour Mohamed Znaidy</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Super sensation sur la séance jambe..."
                    className="w-full h-20 rounded-2xl bg-black/60 border border-white/10 p-3 text-white outline-none focus:border-red-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-500 py-3.5 font-black text-sm text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02]"
                >
                  Envoyer Bilan au Coach
                </button>
              </form>
            </div>

            {/* WEIGHT GRAPH */}
            <div className="lg:col-span-2 rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                  <LineChart size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white">Évolution de ton Poids (kg)</h2>
                  <p className="text-sm text-zinc-400">
                    Visualisation graphique de ta progression
                  </p>
                </div>
              </div>

              <div className="h-72 flex items-end gap-3 border-b border-white/10 pb-4">
                {entries.map((entry) => {
                  const height = ((entry.weight - minWeight) / range) * 180 + 40;

                  return (
                    <div
                      key={entry._id}
                      className="flex-1 flex flex-col items-center gap-3"
                    >
                      <div className="text-xs text-red-400 font-black">
                        {entry.weight}kg
                      </div>

                      <div
                        className="w-full max-w-12 rounded-t-2xl bg-gradient-to-t from-red-700 to-red-400 shadow-lg shadow-red-900/30"
                        style={{ height }}
                      />

                      <div className="text-[10px] text-zinc-500">
                        {new Date(entry.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HISTORIQUE DETAILS */}
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-red-600 flex items-center justify-center">
                <MessageSquare size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">Historique de mes Relevés</h2>
                <p className="text-sm text-zinc-400">
                  Mesures et remarques ajoutées par ton coach
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[...entries].reverse().map((entry) => (
                <article
                  key={entry._id}
                  className="rounded-3xl border border-white/10 bg-black/40 p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <p className="text-red-400 text-xs font-bold uppercase">
                        {new Date(entry.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                      </p>

                      <h3 className="text-3xl font-black mt-1 text-white">
                        {entry.weight} kg
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {entry.waist && <Badge label={`Taille: ${entry.waist} cm`} />}
                      {entry.chest && <Badge label={`Poitrine: ${entry.chest} cm`} />}
                      {entry.arms && <Badge label={`Bras: ${entry.arms} cm`} />}
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs">
                      <p className="text-red-400 font-bold mb-1">Note Coach Mohamed Znaidy :</p>
                      <p className="text-zinc-300 leading-relaxed">{entry.notes}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

const PRBox = ({ label, value, icon: Icon }: any) => (
  <div className="rounded-2xl border border-white/10 bg-black/50 p-4 transition hover:border-red-500/40">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-zinc-400 font-bold">{label}</span>
      <Icon size={16} className="text-red-500" />
    </div>
    <p className="text-xl font-black text-white">{value}</p>
  </div>
);

const StatCard = ({ title, value, icon }: any) => (
  <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 flex items-center justify-between">
    <div>
      <p className="text-sm font-bold text-zinc-400">{title}</p>
      <h3 className="text-3xl font-black mt-1 text-white">{value}</h3>
    </div>

    <div className="h-12 w-12 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400">
      {icon}
    </div>
  </div>
);

const Badge = ({ label }: any) => (
  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
    {label}
  </span>
);

export default MyProgressPage;